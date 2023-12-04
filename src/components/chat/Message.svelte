<script>
	import { tick, onMount, afterUpdate } from 'svelte';
	import axios from 'axios';
	import { StreamChat } from 'stream-chat';
	import { user as userDetails } from '../../store/user';
	import {
		SlashIcon,
		CircleIcon,
		HeartIcon,
		TrashIcon,
		CornerUpLeftIcon,
		VolumeXIcon,
		MoreVerticalIcon,
		Volume2Icon,
		FileTextIcon,
		XIcon,
		UserIcon,
		UserCheckIcon,
		UserMinusIcon,
		SmileIcon,
		PaperclipIcon
	} from 'svelte-feather-icons';
	import {
		reportUserHandler,
		getUserDocs,
		getUsername,
		updateUserRole,
		userMutes
	} from '../../lib/firebase';
	import moment from 'moment';
	import { PUBLIC_STREAM_API_KEY, PUBLIC_STREAM_BACKEND_URL } from '$env/static/public';
	import { filedrop } from 'filedrop-svelte';
	import Sidebar from '../../shared/Sidebar.svelte';
	// import { EmojiButton } from '@joeattardi/emoji-button';
	import routes from '../../routes'

	export let sidebar = false;

	let token = '';
	let username = $userDetails.username;
	let user = $userDetails;
	let channel = '';
	let client = '';
	let messages = [];
	let newMessage = '';
	let members = [];
	let watchers;
	let watcherole;
	let mutedUsers = [];
	let bannedUsers = [];
	let reportUser = '';
	let reportMessage = '';
	let clientEmail = '';
	let clientUid = '';
	let details = [];
	let showLoad = false;
	let ref = null;
	let showSearch = false;
	let picker = '';
	let trigger = '';
	let filteredUsers = [];
	let replymsg = '';
	let files;
	let options = { clickToUpload: false };
	let uploadedImage = '';
	let allMemberNames = [];
	let hint = '';

	const getMatch = (text) => {
		if (text.includes('@')) {
			let newInputVal = text.split('@');
			var match_1 = allMemberNames
				.filter(function (x) {
					return (
						x.toLowerCase() !== newInputVal[1].toLowerCase() &&
						x.toLowerCase().startsWith(newInputVal[1].toLowerCase())
					);
				})
				.sort()[0];
			return match_1;
		}
	};

	const filterUsers = async (e) => {
		newMessage = e.target.value;
		let newInput = newMessage.split('@');
		let match = getMatch(newMessage);
		let storageArr = [];
		if (newMessage.includes('@')) {
			if (newInput[1].length > 5) {
				if (newInput[1].length > 5 && newInput[1].length < 7) {
					await getUserDocs()
						.then((response) => {
							details = response;
						})
						.catch((err) => {
							console.log('user details not found !!', err);
						});
					let data = await channel.query({
						members: { limit: 50, offset: 0 },
						watchers: { limit: 50, offset: 0 }
					});
					members = [];
					let fltrmembr = data.members.filter((mbr) => {
						return mbr.user.id != client.user.id;
					});
					members = [...fltrmembr];
					allMemberNames = [];
					members.map((val, i) => {
						allMemberNames.push(val.user.id);
					});
				}
				allMemberNames.forEach((mbr) => {
					if (mbr.toLowerCase().startsWith(newInput[1].toLowerCase())) {
						storageArr = [...storageArr, makeMatchBold(mbr)];
						hint = mbr;
					}
				});
				// hint = '';
			} else {
				if (match == undefined) {
					hint = '';
				} else {
					hint = match;
				}
			}
		} else if (!newMessage.includes('@')) {
			hint = '';
		}
		filteredUsers = storageArr;
	};

	const makeMatchBold = (str) => {
		let newInputVal = newMessage.split('@');
		let matched = str.substring(0, newInputVal[1].length);
		let makeBold = `<strong>${matched}</strong>`;
		let boldedMatch = str.replace(matched, makeBold);
		if (str.includes('</strong>')) {
			newStr = str.split('</strong>');
			return (newMessage += newStr[1]);
		}
		return boldedMatch;
	};

	$: if (!newMessage.includes('@')) {
		filteredUsers = [];
		hiLiteIndex = null;
	}

	const setInputVal = (username) => {
		let rmBold = removeBold(username);
		newMessage += rmBold;
		hint = '';
		filteredUsers = [];
		hiLiteIndex = null;
		document.getElementById('textAreaMsg').focus();
	};

	const removeBold = (str) => {
		let newStr = str.split('</strong>');
		return newStr[1];
	};

	function handleMentionUserSelect() {
		let newInputVal = newMessage.split('@');
		if (newInputVal[1].length < 1) {
			newMessage += hint;
			hint = '';
		} else {
			let newHint = hint.split(newInputVal[1]);
			newMessage += newHint[1];
			hint = '';
		}
	}

	let hiLiteIndex = null;
	$: hiLitedCountry = filteredUsers[hiLiteIndex];

	const navigateList = (e) => {
		if (e.key === 'ArrowDown' && hiLiteIndex <= filteredUsers.length - 1) {
			hiLiteIndex === null ? (hiLiteIndex = 0) : (hiLiteIndex += 1);
		} else if (e.key === 'ArrowUp' && hiLiteIndex !== null) {
			hiLiteIndex === 0 ? (hiLiteIndex = filteredUsers.length - 1) : (hiLiteIndex -= 1);
		} else if (e.key === 'Enter') {
			setInputVal(filteredUsers[hiLiteIndex]);
		} else if (e.key === 'Tab') {
			// ref.focus();
			if (newMessage.includes('@')) {
				let afterAt = newMessage.split('@');
				if (afterAt[1].length < 1) {
					if (hint == undefined) {
						return;
					} else {
						newMessage += hint;
						hint = '';
						filteredUsers = [];
						// ref.focus();
					}
				} else {
					let newInputVal = hint.split(afterAt[1]);
					if (newInputVal[1] == undefined) {
						return;
					} else {
						newMessage += newInputVal[1];
						hint = '';
						filteredUsers = [];
						// ref.focus();
					}
				}
			} else {
				return;
			}
		} else {
			return;
		}
	};

	async function initializeStream() {
		const { username } = user;
		client = new StreamChat(`${PUBLIC_STREAM_API_KEY}`);
		return client.setUser({ id: username, name: username }, token);
	}

	async function initializeChannel() {
		channel = client.channel('messaging', 'SPY', {
			name: 'SPY'
		});
		watchers = client.user.name;
		watcherole = client.user.role;
		let data = await channel.query({
			members: {},
			watchers: {}
		});
		mutedUsers = client.mutedUsers;
		console.log(mutedUsers);
		await userMutes({ email: clientEmail, mutes: mutedUsers });
		if (mutedUsers.length) {
			let msg = [...data.messages];
			let mutedusrid = mutedUsers.map((val, i) => {
				return val.target.id;
			});
			let checkFltr = [];
			for (let message of msg) {
				if (mutedusrid.includes(message.user.id)) {
					let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
					if (usrData) {
						let muteTime = usrData[0].updated_at;
						let msgTime = message.created_at;
						let compare = moment(msgTime).isAfter(muteTime);
						if (!compare) {
							checkFltr.push(message);
						}
					}
				} else {
					checkFltr.push(message);
				}
			}
			messages = [...checkFltr];
		} else {
			messages = [...data.messages];
		}
		let fltrmembr = data.members.filter((mbr) => {
			return mbr.user.id != client.user.id;
		});
		members = [...fltrmembr];
		allMemberNames = [];
		members.map((val, i) => {
			allMemberNames.push(val.user.id);
		});
		let bannedMembers = [...data.members];
		bannedMembers.map((val, i) => {
			if (val.user.banned === true) {
				bannedUsers.push(val);
			}
		});
		let addMember = await channel.addMembers([client.user.id]);
		return channel.watch();
	}

	async function sendMessage(event) {
		try {
			if (client.user.banned == true) {
				alert(
					'Sorry, you do not have access to this feature. Your account is currently suspended from chat.'
				);
			} else {
				event.preventDefault();
				// ---------------------image upload check---------------------
				if (uploadedImage) {
					if (files) {
						let imageArray = [{ image: uploadedImage }];
						const newmsg = await channel
							.sendMessage({
								attachments: imageArray
							})
							.then(async () => {
								let data = await channel.query({
									members: {},
									watchers: {}
								});
								if (mutedUsers.length) {
									let msg = [...data.messages];
									let mutedusrid = mutedUsers.map((val, i) => {
										return val.target.id;
									});
									let checkFltr = [];
									for (let message of msg) {
										if (mutedusrid.includes(message.user.id)) {
											let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
											if (usrData) {
												let muteTime = usrData[0].updated_at;
												let msgTime = message.created_at;
												let compare = moment(msgTime).isAfter(muteTime);
												if (!compare) {
													checkFltr.push(message);
												}
											}
										} else {
											checkFltr.push(message);
										}
									}
									// messages = [];
									// messages = [...checkFltr];
									members = [];
									let fltrmembr = data.members.filter((mbr) => {
										return mbr.user.id != client.user.id;
									});
									members = [...fltrmembr];
									allMemberNames = [];
									members.map((val, i) => {
										allMemberNames.push(val.user.id);
									});
									uploadedImage = '';
									files = '';
									newMessage = '';
									hint = '';
									alert('image upload success');
									// ref.focus();
									document.getElementById('textAreaMsg').focus();
									return;
								} else {
									// messages = [...data.messages];
									members = [];
									let fltrmembr = data.members.filter((mbr) => {
										return mbr.user.id != client.user.id;
									});
									members = [...fltrmembr];
									allMemberNames = [];
									members.map((val, i) => {
										allMemberNames.push(val.user.id);
									});
									uploadedImage = '';
									files = '';
									newMessage = '';
									hint = '';
									alert('image upload success');
									// ref.focus();
									document.getElementById('textAreaMsg').focus();
									return;
								}
							})
							.catch(() => {
								alert(err.message);
							});
					} else {
						alert('image not found !!');
					}
				}
				// ------------------image upload check ends---------------------
				// ------------------reply function check-------------------------
				else if (replymsg !== '') {
					if (newMessage == '') {
						alert('can not send empty message !');
					} else {
						const res = await channel
							.sendMessage({
								text: newMessage,
								quoted_message_id: replymsg.id
							})
							.then(async () => {
								let data = await channel.query({
									members: {},
									watchers: {}
								});
								if (mutedUsers.length) {
									let msg = [...data.messages];
									let mutedusrid = mutedUsers.map((val, i) => {
										return val.target.id;
									});
									let checkFltr = [];
									for (let message of msg) {
										if (mutedusrid.includes(message.user.id)) {
											let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
											if (usrData) {
												let muteTime = usrData[0].updated_at;
												let msgTime = message.created_at;
												let compare = moment(msgTime).isAfter(muteTime);
												if (!compare) {
													checkFltr.push(message);
												}
											}
										} else {
											checkFltr.push(message);
										}
									}
									// messages = [];
									// messages = [...checkFltr];
									members = [];
									let fltrmembr = data.members.filter((mbr) => {
										return mbr.user.id != client.user.id;
									});
									members = [...fltrmembr];
									allMemberNames = [];
									members.map((val, i) => {
										allMemberNames.push(val.user.id);
									});
									replymsg = '';
									newMessage = '';
									hint = '';
									// ref.focus();
									document.getElementById('textAreaMsg').focus();
									return;
								} else {
									// messages = [...data.messages];
									members = [];
									let fltrmembr = data.members.filter((mbr) => {
										return mbr.user.id != client.user.id;
									});
									members = [...fltrmembr];
									allMemberNames = [];
									members.map((val, i) => {
										allMemberNames.push(val.user.id);
									});
									replymsg = '';
									newMessage = '';
									hint = '';
									// ref.focus();
									document.getElementById('textAreaMsg').focus();
									return;
								}
							})
							.catch(() => {
								alert(err.message);
							});
					}
				}
				// ------------------reply function check ends----------------
				// ------------------send message-----------------
				else {
					if (newMessage == '') {
						alert('can not send empty message !');
					} else {
						let sendMsg = channel
							.sendMessage({
								text: newMessage
							})
							.then(async () => {
								if (newMessage.includes('@')) {
									let newStr = newMessage.split('@');
									let newStr2 = newStr[1].split(' ');

									let MentionEmail = details.filter((val, i) => {
										if (val.username) {
											return val.username.includes(newStr2[0]);
										}
									});
									if (!MentionEmail) {
										newMessage = '';
										hint = '';
										console.log('can not find email of mentioned user!');
									} else {
										let mailData = {
											type: '/user/mention',
											email: MentionEmail[0].email,
											mentionedBy: client.user.name
										};
										axios
											.post(`${PUBLIC_STREAM_BACKEND_URL}`, mailData)
											.then((response) => {})
											.catch((err) => {
												console.log('error occured :: ', err);
											});
										let data = await channel.query({
											members: {},
											watchers: {}
										});
										if (mutedUsers.length) {
											let msg = [...data.messages];
											let mutedusrid = mutedUsers.map((val, i) => {
												return val.target.id;
											});
											let checkFltr = [];
											for (let message of msg) {
												if (mutedusrid.includes(message.user.id)) {
													let usrData = mutedUsers.filter(
														(val) => val.target.id == message.user.id
													);
													if (usrData) {
														let muteTime = usrData[0].updated_at;
														let msgTime = message.created_at;
														let compare = moment(msgTime).isAfter(muteTime);
														if (!compare) {
															checkFltr.push(message);
														}
													}
												} else {
													checkFltr.push(message);
												}
											}
											// messages = [];
											// messages = [...checkFltr];
											members = [];
											let fltrmembr = data.members.filter((mbr) => {
												return mbr.user.id != client.user.id;
											});
											members = [...fltrmembr];
											allMemberNames = [];
											members.map((val, i) => {
												allMemberNames.push(val.user.id);
											});
											newMessage = '';
											hint = '';
											// ref.focus();
											return;
										} else {
											//  messages = [...data.messages];
											members = [];
											let fltrmembr = data.members.filter((mbr) => {
												return mbr.user.id != client.user.id;
											});
											members = [...fltrmembr];
											allMemberNames = [];
											members.map((val, i) => {
												allMemberNames.push(val.user.id);
											});
											newMessage = '';
											hint = '';
											// ref.focus();
										}
									}
								} else {
									let data = await channel.query({
										members: {},
										watchers: {}
									});
									if (mutedUsers.length) {
										let msg = [...data.messages];
										let mutedusrid = mutedUsers.map((val, i) => {
											return val.target.id;
										});
										let checkFltr = [];
										for (let message of msg) {
											if (mutedusrid.includes(message.user.id)) {
												let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
												if (usrData) {
													let muteTime = usrData[0].updated_at;
													let msgTime = message.created_at;
													let compare = moment(msgTime).isAfter(muteTime);
													if (!compare) {
														checkFltr.push(message);
													}
												}
											} else {
												checkFltr.push(message);
											}
										}
										// messages = [];
										// messages = [...checkFltr];
										members = [];
										let fltrmembr = data.members.filter((mbr) => {
											return mbr.user.id != client.user.id;
										});
										members = [...fltrmembr];
										allMemberNames = [];
										members.map((val, i) => {
											allMemberNames.push(val.user.id);
										});
										// ref.focus();
										newMessage = '';
										hint = '';
										document.getElementById('textAreaMsg').focus();
										return;
									} else {
										// messages = [...data.messages];
										members = [];
										let fltrmembr = data.members.filter((mbr) => {
											return mbr.user.id != client.user.id;
										});
										members = [...fltrmembr];
										allMemberNames = [];
										members.map((val, i) => {
											allMemberNames.push(val.user.id);
										});
										// ref.focus();
										newMessage = '';
										hint = '';
										document.getElementById('textAreaMsg').focus();
										return;
									}
								}
							})
							.catch((err) => {
								alert(err.message);
							});
					}
				}
				// --------------send message ends-------------
			}
		} catch (error) {
			console.log('error occured :: ', error);
		}
	}

	async function handleClear() {
		try {
			let confirmDel = confirm('Are tou sure you want to Truncate the channel ?');
			if (confirmDel) {
				if (client.user.role == 'moderator') {
					alert('User with role moderator is not allowed to truncate channel messages.');
				} else if (client.user.role == 'user') {
					alert('User with role user is not allowed to truncate channel messages.');
				} else {
					let res = await channel.truncate({
						hard_delete: true,
						skip_push: false,
						message: {
							text: 'Dear Everyone. The channel has been truncated.',
							user_id: client.user.id
						}
					});
					if (res) {
						alert('All messages Deleted !!');
					} else {
						alert('Failed to delete all messages !!');
					}
				}
			} else {
				console.log('truncate channel cancelled !!');
			}
		} catch (error) {
			console.log('failed to truncate channel :: ', error);
			alert('failed to truncate channel ');
		}
	}

	async function handleChangeRole(event) {
		try {
			if (client.user.role == 'user') {
				alert('You do not have permission for this feature!!');
			} else {
				let userRole = event.role;
				let data = {
					type: '/change-role',
					username: event.name,
					role: userRole
				};
				let changeUserRole = axios
					.post(`${PUBLIC_STREAM_BACKEND_URL}`, data)
					.then(async (response) => {
						watcherole = watcherole == 'moderator' ? 'admin' : 'moderator';
						await updateUserRole({ username: event.name, role: userRole });
						alert('Success!!');
					})
					.catch((Err) => {
						console.log('error :: ', Err);
					});
				if (changeUserRole) {
					let channelData = await channel.query({
						members: {},
						watchers: {}
					});
					if (mutedUsers.length) {
						let msg = [...channelData.messages];
						let mutedusrid = mutedUsers.map((val, i) => {
							return val.target.id;
						});
						let checkFltr = [];
						for (let message of msg) {
							if (mutedusrid.includes(message.user.id)) {
								let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
								if (usrData) {
									let muteTime = usrData[0].updated_at;
									let msgTime = message.created_at;
									let compare = moment(msgTime).isAfter(muteTime);
									if (!compare) {
										checkFltr.push(message);
									}
								}
							} else {
								checkFltr.push(message);
							}
						}
						messages = [...checkFltr];
					} else {
						messages = [...channelData.messages];
					}
					members = [];
					let fltrmembr = channelData.members.filter((mbr) => {
						return mbr.user.id != client.user.id;
					});
					members = [...fltrmembr];
					allMemberNames = [];
					members.map((val, i) => {
						allMemberNames.push(val.user.id);
					});
				}
				await tick();
			}
		} catch (error) {
			console.log('error occured while updating user :: ', error);
			alert('Failed to update user!!');
		}
	}

	async function handleUnbanUser(unban) {
		try {
			if (client.user.role == 'user') {
				alert('You do not have permission for this feature !!');
			} else {
				let data = {
					type: '/unban',
					user: unban
				};
				await axios
					.post(`${PUBLIC_STREAM_BACKEND_URL}`, data)
					.then(async (res) => {
						let afterUnban = await channel.query({
							members: {},
							watchers: {}
						});
						if (mutedUsers.length) {
							let msg = [...afterUnban.messages];
							let mutedusrid = mutedUsers.map((val, i) => {
								return val.target.id;
							});
							let checkFltr = [];
							for (let message of msg) {
								if (mutedusrid.includes(message.user.id)) {
									let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
									if (usrData) {
										let muteTime = usrData[0].updated_at;
										let msgTime = message.created_at;
										let compare = moment(msgTime).isAfter(muteTime);
										if (!compare) {
											checkFltr.push(message);
										}
									}
								} else {
									checkFltr.push(message);
								}
							}
							messages = [...checkFltr];
						} else {
							messages = [...afterUnban.messages];
						}
						members = [];
						let fltrmembr = afterUnban.members.filter((mbr) => {
							return mbr.user.id != client.user.id;
						});
						members = [...fltrmembr];
						allMemberNames = [];
						members.map((val, i) => {
							allMemberNames.push(val.user.id);
						});

						alert('User unbanned !');
					})
					.catch((err) => {
						console.log('error occured !!', err);
					});
			}
		} catch (error) {
			alert(error.message);
		}
	}

	async function handleBanUsers(banuser) {
		try {
			if (client.user.role == 'user') {
				alert('You do not have permission for this feature !!');
			} else {
				let reportEmail = details.filter((val, i) => {
					if (val.username) {
						return val.username.includes(banuser);
					}
				});
				if (!reportEmail) {
					alert('Failed to find email of banned user!');
				} else {
					let data = {
						type: '/banuser',
						user: banuser,
						bannedBy: client.user.name,
						email: reportEmail[0].email
					};
					let banResponse = axios
						.post(`${PUBLIC_STREAM_BACKEND_URL}`, data)
						.then((response) => {
							console.log('mute success !');
						})
						.catch((err) => {
							console.log('failed to ban user !!', err);
						});
					if (banResponse) {
						let afterBanData = await channel.query({
							members: {},
							watchers: {}
						});
						let bannedMembers = [...afterBanData.members];
						bannedMembers.map((val, i) => {
							if (val.user.banned == true) {
								bannedUsers.push(val);
							}
						});
						members = [];
						let fltrmembr = afterBanData.members.filter((mbr) => {
							return mbr.user.id != client.user.id;
						});
						members = [...fltrmembr];
						allMemberNames = [];
						members.map((val, i) => {
							allMemberNames.push(val.user.id);
						});
						if (mutedUsers.length) {
							let msg = [...afterBanData.messages];
							let mutedusrid = mutedUsers.map((val, i) => {
								return val.target.id;
							});
							let checkFltr = [];
							for (let message of msg) {
								if (mutedusrid.includes(message.user.id)) {
									let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
									if (usrData) {
										let muteTime = usrData[0].updated_at;
										let msgTime = message.created_at;
										let compare = moment(msgTime).isAfter(muteTime);
										if (!compare) {
											checkFltr.push(message);
										}
									}
								} else {
									checkFltr.push(message);
								}
							}
							messages = [...checkFltr];
						} else {
							messages = [...afterBanData.messages];
						}
						alert('User Banned !!');
					} else {
						alert('user ban failed !!');
					}
				}
				await tick();
			}
		} catch (error) {
			console.log('error occured :: ', error);
		}
	}

	async function handleDeleteMessage(msg) {
		try {
			let confirmDelete = confirm('Do you want to Delete this Message ?');
			if (confirmDelete) {
				if (client.user.role == 'moderator' || client.user.role == 'admin') {
					if (msg.attachments.length > 0) {
						let del = await channel.deleteFile(msg.attachments[0].image);
						if (del) {
							let data = await channel.query({
								members: {},
								watchers: {}
							});
							if (mutedUsers.length) {
								let msg = [...data.messages];
								let mutedusrid = mutedUsers.map((val, i) => {
									return val.target.id;
								});
								let checkFltr = [];
								for (let message of msg) {
									if (mutedusrid.includes(message.user.id)) {
										let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
										if (usrData) {
											let muteTime = usrData[0].updated_at;
											let msgTime = message.created_at;
											let compare = moment(msgTime).isAfter(muteTime);
											if (!compare) {
												checkFltr.push(message);
											}
										}
									} else {
										checkFltr.push(message);
									}
								}
								messages = [...checkFltr];
							} else {
								messages = [...data.messages];
							}
							members = [];
							let fltrmembr = data.members.filter((mbr) => {
								return mbr.user.id != client.user.id;
							});
							members = [...fltrmembr];
							allMemberNames = [];
							members.map((val, i) => {
								allMemberNames.push(val.user.id);
							});
						} else {
							alert('failed to deleted file !! ');
						}
					}
					let deleteMsg = await client.deleteMessage(msg.id);
					if (deleteMsg) {
						await tick();
						let data = await channel.query({
							members: {},
							watchers: {}
						});
						if (mutedUsers.length) {
							let msg = [...data.message];
							let mutedusrid = mutedUsers.map((val, i) => {
								return val.target.id;
							});
							let checkFltr = [];
							for (let message of msg) {
								if (mutedusrid.includes(message.user.id)) {
									let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
									if (usrData) {
										let muteTime = usrData[0].updated_at;
										let msgTime = message.created_at;
										let compare = moment(msgTime).isAfter(muteTime);
										if (!compare) {
											checkFltr.push(message);
										}
									}
								} else {
									checkFltr.push(message);
								}
							}
							messages = [...checkFltr];
						} else {
							messages = [...data.messages];
						}
						members = [];
						let fltrmembr = data.members.filter((mbr) => {
							return mbr.user.id != client.user.id;
						});
						members = [...fltrmembr];
						allMemberNames = [];
						members.map((val, i) => {
							allMemberNames.push(val.user.id);
						});
					} else {
						alert('Failed to deleteMsg !!');
					}
				} else if (client.user.role == 'user') {
					if (msg.user.id == client.user.id) {
						if (msg.attachments.length > 0) {
							let del = await channel.deleteFile(msg.attachments[0].image);
							if (del) {
								let data = await channel.query({
									members: {},
									watchers: {}
								});
								if (mutedUsers.length) {
									let msg = [...data.messages];
									let mutedusrid = mutedUsers.map((val, i) => {
										return val.target.id;
									});
									let checkFltr = [];
									for (let message of msg) {
										if (mutedusrid.includes(message.user.id)) {
											let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
											if (usrData) {
												let muteTime = usrData[0].updated_at;
												let msgTime = message.created_at;
												let compare = moment(msgTime).isAfter(muteTime);
												if (!compare) {
													checkFltr.push(message);
												}
											}
										} else {
											checkFltr.push(message);
										}
									}
									messages = [...checkFltr];
								} else {
									messages = [...data.messages];
								}
								members = [];
								let fltrmembr = data.members.filter((mbr) => {
									return mbr.user.id != client.user.id;
								});
								members = [...fltrmembr];
								allMemberNames = [];
								members.map((val, i) => {
									allMemberNames.push(val.user.id);
								});
							} else {
								alert('failed to deleted file !! ');
							}
						}
						let deleteMsg = await client.deleteMessage(msg.id);
						if (deleteMsg) {
							await tick();
							let data = await channel.query({
								members: {},
								watchers: {}
							});
							if (mutedUsers.length) {
								let msg = [...data.messages];
								let mutedusrid = mutedUsers.map((val, i) => {
									return val.target.id;
								});
								let checkFltr = [];
								for (let message of msg) {
									if (mutedusrid.includes(message.user.id)) {
										let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
										if (usrData) {
											let muteTime = usrData[0].updated_at;
											let msgTime = message.created_at;
											let compare = moment(msgTime).isAfter(muteTime);
											if (!compare) {
												checkFltr.push(message);
											}
										}
									} else {
										checkFltr.push(message);
									}
								}
								messages = [...checkFltr];
							} else {
								messages = [...data.messages];
							}
							members = [];
							let fltrmembr = data.members.filter((mbr) => {
								return mbr.user.id != client.user.id;
							});
							members = [...fltrmembr];
							allMemberNames = [];
							members.map((val, i) => {
								allMemberNames.push(val.user.id);
							});
						} else {
							alert('Failed to deleteMsg !!');
						}
					} else {
						alert("you can not delete other user's message !!");
					}
				}
			} else {
				console.log('message not deleted !!');
			}
		} catch (err) {
			console.log('error occured !! ', err);
		}
	}

	async function handleUnmuteUser(id) {
		try {
			await client
				.unmuteUser(id, null, {
					timeout: 1
				})
				.then(async (res) => {
					mutedUsers = client.mutedUsers;
					await userMutes({ email: clientEmail, mutes: mutedUsers });
					let getMessages = await channel.query({
						members: {},
						watchers: {}
					});
					if (mutedUsers.length) {
						let msg = [...getMessages.messages];
						let mutedusrid = mutedUsers.map((val, i) => {
							return val.target.id;
						});
						let checkFltr = [];
						for (let message of msg) {
							if (mutedusrid.includes(message.user.id)) {
								let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
								if (usrData) {
									let muteTime = usrData[0].updated_at;
									let msgTime = message.created_at;
									let compare = moment(msgTime).isAfter(muteTime);
									if (!compare) {
										checkFltr.push(message);
									}
								}
							} else {
								checkFltr.push(message);
							}
						}
						messages = [...checkFltr];
					} else {
						messages = [...getMessages.messages];
					}
					let getMutedUsers = mutedUsers.filter((m) => m.user.id !== id);
					mutedUsers = [...getMutedUsers];
					members = [];
					let fltrmembr = getMessages.members.filter((mbr) => {
						return mbr.user.id != client.user.id;
					});
					members = [...fltrmembr];
					allMemberNames = [];
					members.map((val, i) => {
						allMemberNames.push(val.user.id);
					});
					if (mutedUsers.length) {
						let msg = [...getMessages.messages];
						let mutedusrid = mutedUsers.map((val, i) => {
							return val.target.id;
						});
						let checkFltr = [];
						for (let message of msg) {
							if (mutedusrid.includes(message.user.id)) {
								let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
								if (usrData) {
									let muteTime = usrData[0].updated_at;
									let msgTime = message.created_at;
									let compare = moment(msgTime).isAfter(muteTime);
									if (!compare) {
										checkFltr.push(message);
									}
								}
							} else {
								checkFltr.push(message);
							}
						}
						messages = [...checkFltr];
					} else {
						messages = [...getMessages.messages];
					}
					alert('Unmute success !');
				})
				.catch((err) => {
					console.log('error while unmutting :: ', err);
					alert('Failed to unmute user!! Try again later!');
				});
		} catch (error) {
			console.log('error occured !! ', error);
			alert(error.message);
		}
	}

	async function handleMuteUser(e) {
		try {
			let usrPrompt = prompt('Enter number of hours the user to be muted!!');
			let hrs = Number(usrPrompt);
			if (hrs) {
				if (hrs <= 0) {
					alert('Number of hours must be greater than zero!!');
				} else {
					await client
						.muteUser(e, null, {
							timeout: 60 * hrs
						})
						.then(async (res) => {
							mutedUsers.push(res.mute);
							await userMutes({ email: clientEmail, mutes: mutedUsers });
							let getMessages = await channel.query({
								members: {},
								watchers: {}
							});
							if (mutedUsers.length) {
								let msg = [...getMessages.messages];
								let mutedusrid = mutedUsers.map((val, i) => {
									return val.target.id;
								});
								let checkFltr = [];
								for (let message of msg) {
									if (mutedusrid.includes(message.user.id)) {
										let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
										if (usrData) {
											let muteTime = usrData[0].updated_at;
											let msgTime = message.created_at;
											let compare = moment(msgTime).isAfter(muteTime);
											if (!compare) {
												checkFltr.push(message);
											}
										}
									} else {
										checkFltr.push(message);
									}
								}
								messages = [...checkFltr];
							} else {
								messages = [...getMessages.messages];
							}
							members = [];
							let fltrmembr = getMessages.members.filter((mbr) => {
								return mbr.user.id != client.user.id;
							});
							members = [...fltrmembr];
							allMemberNames = [];
							members.map((val, i) => {
								allMemberNames.push(val.user.id);
							});
							alert('Mute success !!');
						})
						.catch((err) => {
							console.log('error occured!! ', err);
							alert('Failed to mute user !! Try again later!');
						});
				}
			} else {
				alert('invalid input!');
			}
		} catch (error) {
			console.log('error occured :: ', error);
		}
	}

	async function handleReaction(id) {
		try {
			let reaction = await channel.sendReaction(id, {
				type: 'like'
			});
			if (reaction) {
				let data = await channel.query({
					members: {},
					watchers: {}
				});
				if (mutedUsers.length) {
					let msg = [...data.messages];
					let mutedusrid = mutedUsers.map((val, i) => {
						return val.target.id;
					});
					let checkFltr = [];
					for (let message of msg) {
						if (mutedusrid.includes(message.user.id)) {
							let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
							if (usrData) {
								let muteTime = usrData[0].updated_at;
								let msgTime = message.created_at;
								let compare = moment(msgTime).isAfter(muteTime);
								if (!compare) {
									checkFltr.push(message);
								}
							}
						} else {
							checkFltr.push(message);
						}
					}
					messages = [...checkFltr];
				} else {
					messages = [...data.messages];
				}
				members = [];
				let fltrmembr = data.members.filter((mbr) => {
					return mbr.user.id != client.user.id;
				});
				members = [...fltrmembr];
				allMemberNames = [];
				members.map((val, i) => {
					allMemberNames.push(val.user.id);
				});
			} else {
				alert('failed to add reaction !');
			}
		} catch (error) {
			console.log('error occured while reacting to a message :: ', error);
		}
	}

	async function setReplyMsg(msg) {
		try {
			replymsg = msg;
		} catch (error) {
			console.log('failed to set reply message !! ', error);
		}
	}

	async function handleCancel() {
		try {
			let deleteImg = await channel.deleteFile(uploadedImage);
			uploadedImage = '';
			files = '';
			newMessage = '';
			if (deleteImg) {
				alert('image removed !');
			} else {
				alert('failed to delete image from CDN !!');
			}
		} catch (error) {
			console.log('error occured !', error);
		}
	}

	async function handleImageUpload(event) {
		try {
			showLoad = true;
			if (event.target.files) {
				files = event.target.files;
				files = event.target.files[0];
				const response = await channel.sendFile(files);
				uploadedImage = response.file;
				if (response) {
					showLoad = false;
				} else if (!response) {
					showLoad = false;
					alert('Failed to upload image !! Try again later.');
				}
			} else {
				files = event.detail.files;
				files = event.detail.files.accepted[0];
				const response = await channel.sendFile(files);
				uploadedImage = response.file;
				if (response) {
					showLoad = false;
				} else if (!response) {
					showLoad = false;
					alert('Failed to upload image !! Try again later.');
				}
			}
		} catch (error) {
			console.log('error occured in handle image upload function :: ', error);
		}
	}

	async function handleSearch() {
		try {
			let searchPrompt = prompt(
				'Enter text to Search!! This search will include results from all chats.'
			);
			if (searchPrompt == '' || searchPrompt == undefined || searchPrompt == null) {
				alert('Search cancelled !!');
			} else {
				const filters = { members: { $in: [client.user.id] } };
				const search = await client.search(filters, searchPrompt, { limit: 50, offset: 0 });
				let searchResult =
					search.results.length &&
					search.results.map((val, i) => {
						return val.message;
					});
				messages = [...searchResult];
				showSearch = true;
			}
		} catch (error) {
			console.log('search failed :: ', error);
		}
	}

	async function handleReport(data) {
		try {
			if (clientEmail == '') {
				alert('User email not Found !!');
			} else if (reportUser == '') {
				alert('Reported User not Found !!');
			} else if (clientUid == '') {
				alert('User id not found !!');
			} else if (reportMessage == '') {
				alert('Please enter a message to file report !');
			} else {
				let reportData = {
					type: '/report/user',
					userEmail: clientEmail,
					reportedUser: reportUser,
					message: data,
					uid: clientUid
				};
				reportMessage = '';
				reportUser = '';
				let sendReport = await reportUserHandler(reportData);
				if (sendReport) {
					if (sendReport.status == true) {
						axios
							.post(`${PUBLIC_STREAM_BACKEND_URL}`, reportData)
							.then((response) => {
								alert('Report filed Successfully !!');
							})
							.catch((err) => {
								alert('Failed to file report!! Try again later !');
								console.log('error occured while sending email :: ', err);
							});
					} else {
						alert('Failed to send report details!! Try again later !');
					}
				} else {
					console.log('failed to send report !!');
				}
			}
		} catch (error) {}
	}

	async function handleHome() {
		try {
			showSearch = false;
			let data = await channel.query({
				members: {},
				watchers: {}
			});
			if (mutedUsers.length) {
				let msg = [...data.messages];
				let mutedusrid = mutedUsers.map((val, i) => {
					return val.target.id;
				});
				let checkFltr = [];
				for (let message of msg) {
					if (mutedusrid.includes(message.user.id)) {
						let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
						if (usrData) {
							let muteTime = usrData[0].updated_at;
							let msgTime = message.created_at;
							let compare = moment(msgTime).isAfter(muteTime);
							if (!compare) {
								checkFltr.push(message);
							}
						}
					} else {
						checkFltr.push(message);
					}
				}
				messages = [...checkFltr];
			} else {
				messages = [...data.messages];
			}
			members = [];
			let fltrmembr = data.members.filter((mbr) => {
				return mbr.user.id != client.user.id;
			});
			members = [...fltrmembr];
			allMemberNames = [];
			members.map((val, i) => {
				allMemberNames.push(val.user.id);
			});
		} catch (error) {
			console.log('error occureed while getting channel messages!!');
		}
	}

	afterUpdate(() => {
		var elem = document.getElementById('messageBox');
		if (elem) {
			elem.scrollTop = elem.scrollHeight;
		} else {
			return;
		}
	});

	onMount(async () => {
		try {
			// picker = new EmojiButton({
			//   showSearch:false
			// });
			// trigger = document.querySelector('.trigger');
			// picker.on('emoji', selection => {
			//   newMessage += selection.emoji;
			//   document.getElementById('textAreaMsg').focus();
			// });
			// trigger.addEventListener('click', () => picker.togglePicker(trigger));
			// getUserDocs().then(response =>{
			//   details = response
			// }).catch(err => {
			//   console.log("user details not found !!",err);
			// })
			// let getUserEmail = localStorage.getItem('firebase:authUser:AIzaSyCXd_fxvz5zxwnFpyULZrLz4LbuXGhAhew:[DEFAULT]');
			// let userEmail = JSON.parse(getUserEmail);
			// clientEmail = userEmail.email;
			// clientUid = JSON.parse(getUserEmail).uid;
			// let emailUsername = userEmail.email.split('@');
			// let getuser = await getUsername({email: clientEmail});
			// let username = getuser;
			// let username = {
			// 	username: 'willsmith'
			// };
			if (username) {
				console.log('inside if check !!');
				axios
					.post(`${PUBLIC_STREAM_BACKEND_URL}`, {
						type: '/join',
						username: "willsmith",
						role: 'admin'
					})
					.then((response) => {
						console.log('inside then');
						const { data } = response;
						username = '';
						user = data.user;
						token = data.token;
						return initializeStream();
					})
					.then(() => {
						console.log('inside second then');
						initializeChannel();
					})
					.then(async (room) => {
						// messages = room.messages
						channel.on('message.new', async (event) => {
							let data = await channel.query({
								members: {},
								watchers: {}
							});
							if (mutedUsers.length) {
								let msg = [...data.messages];
								let mutedusrid = mutedUsers.map((val, i) => {
									return val.target.id;
								});
								if (mutedusrid.includes(event.message.user.id)) {
									let checkFltr = [];
									for (let message of msg) {
										if (mutedusrid.includes(message.user.id)) {
											let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
											if (usrData) {
												let muteTime = usrData[0].updated_at;
												let msgTime = message.created_at;
												let compare = moment(msgTime).isAfter(muteTime);
												if (!compare) {
													checkFltr.push(message);
												}
											}
										} else {
											checkFltr.push(message);
										}
									}
									messages = [...messages];
									var elem = document.getElementById('messageBox');
									elem.scrollTop = elem.scrollHeight;
									return;
								} else {
									messages = [...data.messages];
									return;
								}
							} else if (!mutedUsers.length) {
								messages = [...data.messages];
								var elem = document.getElementById('messageBox');
								elem.scrollTop = elem.scrollHeight;
								return;
							} else {
								return;
							}
						});
					})
					.catch((err) => {
						console.log('inside error :: ', err);
					});
			} else {
				console.log('inside else check !!');
				axios
					.post(`${PUBLIC_STREAM_BACKEND_URL}`, {
						type: '/join',
						username: "willsmith",
						role: 'admin'
					})
					.then((response) => {
						const { data } = response;
						username = '';
						user = data.user;
						token = data.token;
						return initializeStream();
					})
					.then(() => {
						initializeChannel();
					})
					.then(async (room) => {
						// messages = room.messages
						channel.on('message.new', async (event) => {
							let data = await channel.query({
								members: {},
								watchers: {}
							});
							if (mutedUsers.length) {
								let msg = [...data.messages];
								let mutedusrid = mutedUsers.map((val, i) => {
									return val.target.id;
								});
								if (mutedusrid.includes(event.message.user.id)) {
									let checkFltr = [];
									for (let message of msg) {
										if (mutedusrid.includes(message.user.id)) {
											let usrData = mutedUsers.filter((val) => val.target.id == message.user.id);
											if (usrData) {
												let muteTime = usrData[0].updated_at;
												let msgTime = message.created_at;
												let compare = moment(msgTime).isAfter(muteTime);
												if (!compare) {
													checkFltr.push(message);
												}
											}
										} else {
											checkFltr.push(message);
										}
									}
									messages = [...messages];
									var elem = document.getElementById('messageBox');
									elem.scrollTop = elem.scrollHeight;
									return;
								}
								messages = [...data.messages];
								return;
							} else if (!mutedUsers.length) {
								messages = [...data.messages];
								var elem = document.getElementById('messageBox');
								elem.scrollTop = elem.scrollHeight;
								return;
							} else {
								return;
							}
						});
					})
					.catch(console.error);
			}
		} catch (err) {
			console.log('error occured while joining room !! ', err);
		}
	});
</script>

<svelte:window on:keydown={navigateList} />

<div class="header">
	<div class="title">Chat <span>: @{$userDetails.username || ''}</span></div>
	<div class="options">
		<a href={routes.chat()} class="option">
			<i class="icofont-external-link" />
		</a>
	</div>
</div>

<div class="messages" id="messageBox">
	{#each messages as message}
		<div class="list">
			<div class="headshot">
				<img src="assets/images/headshot-chat.png" alt="IH" />
			</div>
			<div class="content" use:filedrop={options} on:filedrop={handleImageUpload}>
				<div class="title">
					<div class="iconSize">
						{#if message.user.id === client.user.id}
							{#if message.user.role == 'admin'}
								<span class="name">You</span>
							{/if}
							{#if message.user.role == 'moderator'}
								<span class="name">You</span>
							{/if}
							{#if message.user.role == 'user'}
								<span class="name">You</span>
							{/if}
						{:else}
							{#if message.user.role == 'admin'}
								<span class="name">{message.user.id}</span>
							{/if}
							{#if message.user.role == 'moderator'}
								<span class="name">{message.user.id}</span>
							{/if}
							{#if message.user.role == 'user'}
								<span class="name">{message.user.id}</span>
							{/if}
						{/if}
						{#if mutedUsers.length}
							{#each mutedUsers as mute}
								{#if mute.target.id == message.user.id}
									<span class="liked-ico"><VolumeXIcon /></span>
								{/if}
							{/each}
						{/if}
						{#if bannedUsers.length}
							{#each bannedUsers as ban}
								{#if ban.user.id == message.user.id}
									<span class="liked-ico"><SlashIcon /></span>
								{/if}
							{/each}
						{/if}
						{#if message && message.latest_reactions && message.latest_reactions.length > 0}
							<span class="liked-ico"><HeartIcon /></span>
						{/if}
					</div>
					<span class="time">{moment(message.updated_at).format('LT')}</span>
				</div>
				<div class="msgReportSection">
					<div class="message">
						{#if message.quoted_message}
							{#if message.quoted_message.text == '' && message.quoted_message.attachments.length > 0}
								<p style="font-size:15px; font-style:italic; color:#e3e3e3">Replied to :</p>
								<img
									src={message.quoted_message.attachments[0].image}
									alt={'quoted image'}
									height="50px"
									width="50px"
								/>
							{:else}
								<p style="font-size:15px; font-style:italic; color:#e3e3e3">
									Replied to : "{message.quoted_message.text}"
								</p>
							{/if}
						{/if}
						{#if message.text == ''}
							{#if message.attachments && message.attachments.length > 0}
								<img src={message.attachments[0].image} alt={'test'} />
							{:else}
								{console.log('unable to find file attachments !!')}
							{/if}
						{/if}
						{message.text}
					</div>
					<div class="report">
						<button
							title="Like"
							on:click={handleReaction(message.id)}
							value={message.id}
							class="btnAction"><HeartIcon /></button
						>
						<button title="Delete message" on:click={handleDeleteMessage(message)} class="btnAction"
							><TrashIcon /></button
						>
						<button title="Reply" on:click={setReplyMsg(message)} class="btnAction"
							><CornerUpLeftIcon /></button
						>
						{#if client.user.id !== message.user.id}
							<button
								title="Mute User"
								on:click={handleMuteUser(message.user.id)}
								value={message.user.id}
								class="btnAction"
							>
								<VolumeXIcon />
							</button>
							<button
								title="UnMute User"
								on:click={handleUnmuteUser(message.user.id)}
								value={message.user.id}
								class="btnAction"><Volume2Icon /></button
							>
							<div class="dropdown custom-dropbx">
								<button
									title="Show More"
									class="btnAction"
									type="button"
									id="dropdownMenu2"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									<MoreVerticalIcon />
								</button>
								<ul
									class="dropdown-menu custom-dropdown"
									style="position:top"
									aria-labelledby="dropdownMenu2"
								>
									{#if client.user.role == 'user'}
										<li>
											<button
												title="Report"
												class="btnAction"
												on:click={() => (reportUser = message.user.id)}
												data-bs-toggle="modal"
												data-bs-target="#reportModal1"
												type="button"><FileTextIcon /></button
											>
										</li>
									{/if}
									{#if client.user.role == 'moderator'}
										<li>
											<button
												title="Ban User"
												class="btnAction"
												on:click={handleBanUsers(message.user.id)}
												type="button"><SlashIcon /></button
											>
										</li>
										<li>
											<button
												title="UnBan User"
												class="btnAction"
												on:click={handleUnbanUser(message.user.id)}
												type="button"><CircleIcon /></button
											>
										</li>
										<li>
											<button
												title="Report"
												class="btnAction"
												on:click={() => (reportUser = message.user.id)}
												data-bs-toggle="modal"
												data-bs-target="#reportModal1"
												type="button"><FileTextIcon /></button
											>
										</li>
									{/if}
									{#if client.user.role == 'admin'}
										<li>
											<button
												title="Make Admin"
												class="btnAction"
												on:click={handleChangeRole({ name: message.user.id, role: 'admin' })}
												type="button"><UserCheckIcon /></button
											>
										</li>
										<li>
											<button
												title="Make Moderator"
												class="btnAction"
												on:click={handleChangeRole({ name: message.user.id, role: 'moderator' })}
												type="button"><UserMinusIcon /></button
											>
										</li>
										<li>
											<button
												title="Make User"
												class="btnAction"
												on:click={handleChangeRole({ name: message.user.id, role: 'user' })}
												type="button"><UserIcon /></button
											>
										</li>
										<li>
											<button
												title="Ban User"
												class="btnAction"
												on:click={handleBanUsers(message.user.id)}
												type="button"><SlashIcon /></button
											>
										</li>
										<li>
											<button
												title="UnBan User"
												class="btnAction"
												on:click={handleUnbanUser(message.user.id)}
												type="button"><CircleIcon /></button
											>
										</li>
										<li>
											<button
												title="Report"
												class="btnAction"
												on:click={() => (reportUser = message.user.id)}
												data-bs-toggle="modal"
												data-bs-target="#reportModal1"
												type="button"><FileTextIcon /></button
											>
										</li>
									{/if}
								</ul>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<div class="send-message" class:left-auto={sidebar} class:w-48={sidebar}>
	{#if replymsg}
		<div class="reply-box">
			<button
				type="button"
				style="color:#fff"
				on:click={() => {
					replymsg = '';
				}}><XIcon /></button
			>
			{#if replymsg.text == '' && replymsg.attachments && replymsg.attachments.length > 0}
				<p style="color:#fff">Replying to:</p>
				<img src={replymsg.attachments[0].image} alt={'quoted image'} height="50px" width="50px" />
			{:else}
				<p style="color:#fff">Replying to : `{replymsg.text}`</p>
			{/if}
		</div>
	{/if}
	<div class="msg-form ">
		<form on:submit={sendMessage}>
			<div class="file-input file-uploadbx">
				<label for="file-input" class="custom-file">
					<PaperclipIcon />
				</label>
				<input
					type="file"
					on:change={handleImageUpload}
					id="file-input"
					class="file-input__input"
				/>
			</div>
			<div class="chatbox-inner">
				<!-- <input type="file"  on:change={handleImageUpload} id="file-input" class="file-input__input" /> -->
				<input
					id="textAreaMsg"
					placeholder="Type Message.."
					on:input={(e) => filterUsers(e)}
					bind:value={newMessage}
					name="newMessage"
					type="text"
					class="sent-message"
				/>
				<div class="trg-form">
					<button
						class="trigger"
						on:click|preventDefault={() => {
							console.log();
						}}><SmileIcon /></button
					>
				</div>
			</div>
			<button type="submit">
				<i class="icofont-paper-plane" />
			</button>
		</form>
	</div>
</div>

<!-- Modal -->
<div
	class="modal fade reportModal report-usermodal"
	id="reportModal1"
	tabindex="-1"
	role="dialog"
	aria-labelledby="reportModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="exampleModal33Label">
					Report User - <i>{reportUser}</i>
				</h5>
				<button type="button" class="close btn-close" data-bs-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form class="form" autocomplete="off">
					<div class="report-message-type">
						<input
							id="mention"
							autocomplete="off"
							maxlength="150"
							type="text"
							bind:value={reportMessage}
							name="reportMessage"
							placeholder="Enter your message"
							style="width: 100%"
						/>
					</div>
					<div class="form-button">
						<button
							type="submit"
							data-bs-dismiss="modal"
							class="btn btn-primary buttonPostion"
							on:click|preventDefault={handleReport(reportMessage)}>Send Report</button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
{#if uploadedImage}
	<div class="imageCard-popup">
		<div class="card card-upload" style="width: 18rem;">
			<img class="card-img-top" src={uploadedImage} alt={'Card image cap'} />
			<div class="card-body">
				<h5 class="card-title">{files.name}</h5>
				<button class="btn btn-primary" on:click={handleCancel}>Cancel</button>
				<button class="btn btn-primary" on:click={sendMessage}>Send</button>
			</div>
		</div>
	</div>
{/if}

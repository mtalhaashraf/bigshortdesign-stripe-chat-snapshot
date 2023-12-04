<script>
	import TextField from './TextField.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const handleSubmit = (e) => {
		const formData = new FormData(e.target);

		const data = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		dispatch('submit', data);
	};
</script>

<main class="agreemet-container">
	<form on:submit|preventDefault={handleSubmit} class="layout">
		<h2 style="padding-top: 3pt;text-indent: 0pt;text-align: right;">EXHIBIT B</h2>
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<h2
			style="padding-top: 4pt;padding-left: 124pt;text-indent: 47pt;line-height: 200%;text-align: left;"
		>
			AGREEMENT FOR MARKET DATA DISPLAY SERVICES
		</h2>
		<h2 style="text-indent: 0pt;text-align: center;">(Nonprofessional Subscriber Status)</h2>
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<p class="s1" style="padding-top: 4pt;text-align: center;">
			<TextField name="name" bottom />
			<!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
			<span class="p">[NAME OF VENDOR/BROKER DEALER] (&quot;Vendor&quot;)</span>
			<!-- <span class="p">NAME OF VENDOR/BROKER DEALER</span> -->
		</p>
		<p style="padding-left: 5pt;text-indent: 0pt;text-align: justify;">
			agrees to make &quot;Market Data&quot; available to you pursuant to the terms and conditions
			set forth in this agreement. By executing this Agreement in the space indicated below, you
			(&quot;Subscriber&quot;) agree to comply with those terms and conditions. Section 1 sets forth
			terms and conditions of general applicability. Section 2 applies insofar as Subscriber
			receives and uses Market Data made available pursuant to this Agreement as a Nonprofessional
			Subscriber.
		</p>
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<p class="s2" style="padding-top: 10pt;text-indent: 0pt;text-align: center;">
			SECTION 1: TERMS AND CONDITIONS OF GENERAL APPLICABILITY
		</p>
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<ol id="l1">
			<li data-list-text="1.">
				<h2 style="padding-top: 4pt;padding-left: 5pt;text-indent: 35pt;text-align: justify;">
					MARKET DATA DEFINITION – <span class="p"
						>For all purposes of this Agreement, &quot;Market Data&quot; means (a) last sale
						information and quotation information relating to securities that are admitted to
						dealings on the New York Stock Exchange (&quot;NYSE*&quot;), (b) such bond and other
						equity last sale and quotation information, and such index and other market information,
						as United States-registered national securities exchanges and national securities
						associations (each, an &quot;Authorizing SRO&quot;) may make available and as the NYSE*
						may from time to time designate as &quot;Market Data&quot;; and (c) all information that
						derives from any such information.</span
					>
				</h2>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="2.">
				<h2 style="padding-left: 5pt;text-indent: 35pt;text-align: justify;">
					PROPRIETARY NATURE OF DATA – <span class="p"
						>Subscriber understands and acknowledges that each Authorizing SRO and Other Data
						Disseminator has a proprietary interest in the Market Data that originates on or derives
						from it or its market(s).</span
					>
				</h2>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="3.">
				<h2 style="padding-left: 5pt;text-indent: 35pt;text-align: justify;">
					ENFORCEMENT – <span class="p"
						>Subscriber understands and acknowledges that (a) the Authorizing SROs are third-party
						beneficiaries under this Agreement and (b) the Authorizing SROs or their authorized
						representative(s) may enforce this Agreement, by legal proceedings or otherwise, against
						Subscriber or any person that obtains Market Data that is made available pursuant to
						this Agreement other than as this Agreement contemplates. Subscriber shall pay the
						reasonable attorney&#39;s fees that any Authorizing SRO incurs in enforcing this
						Agreement against Subscriber.</span
					>
				</h2>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="4.">
				<h2 style="padding-left: 5pt;text-indent: 35pt;text-align: justify;">
					DATA NOT GUARANTEED – <span class="p"
						>Subscriber understands that no Authorizing SRO, no other entity whose information is
						made available over the Authorizing SROs&#39; facilities (an &quot;Other Data
						Disseminator&quot;) and no information processor that assists any Authorizing SRO or
						Other Data Disseminator in making Market Data available (collectively, the
						&quot;Disseminating Parties&quot;) guarantees the timeliness, sequence, accuracy or
						completeness of Market Data or of</span
					>
				</h2>
				<p style="padding-top: 3pt;padding-left: 5pt;text-indent: 0pt;text-align: justify;">
					other market information or messages disseminated by any Disseminating Party. Neither
					Subscriber nor any other person shall hold any Disseminating Party liable in any way for
					(a) any inaccuracy, error or delay in, or omission of, (i) any such data, information or
					message or (ii) the transmission or delivery of any such data, information or message, or
					(b) any loss or damage arising from or occasioned by (i) any such inaccuracy, error, delay
					or omission, (ii) non-performance or (iii) interruption in any such data, information or
					message, due either to any negligent act or omission by any Disseminating Party, to any
					&quot;force majeure&quot; (e.g., flood, extraordinary weather conditions, earthquake or
					other act of God, fire, war, insurrection, riot, labor dispute, accident, action of
					government, communications or power failure, equipment or software malfunction) or to any
					other cause beyond the reasonable control of any Disseminating Party.
				</p>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="5.">
				<h2 style="padding-left: 5pt;text-indent: 35pt;text-align: justify;">
					PERMITTED USE <span class="p"
						>– Subscriber shall not furnish Market Data to any other person or entity. If Subscriber
						receives Market Data other than as a Nonprofessional Subscriber, it shall use Market
						Data only for its individual use in its business.</span
					>
				</h2>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="6.">
				<h2 style="padding-left: 77pt;text-indent: -36pt;line-height: 13pt;text-align: left;">
					DISSEMINATION DISCONTINUANCE OR MODIFICATION –
				</h2>
				<p style="padding-left: 5pt;text-indent: 0pt;text-align: justify;">
					Subscriber understands and acknowledges that, at any time, the Authorizing SROs may
					discontinue disseminating any category of Market Data, may change or eliminate any
					transmission method and may change transmission speeds or other signal characteristics.
					The Authorizing SROs shall not be liable for any resulting liability, loss or damages that
					may arise therefrom.
				</p>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="7.">
				<h2 style="padding-left: 5pt;text-indent: 35pt;text-align: justify;">
					DURATION; SURVIVAL – <span class="p"
						>This Agreement remains in effect for so long as Subscriber has the ability to receive
						Market Data as contemplated by this Agreement. In addition, Vendor may terminate this
						Agreement at any time, whether at the direction of the Authorizing SROs or otherwise.
						Paragraphs 2, 3 and 4, and the first two sentences of Paragraph 8, survive any
						termination of this Agreement.</span
					>
				</h2>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="8.">
				<h2 style="padding-left: 5pt;text-indent: 35pt;text-align: justify;">
					MISCELLANEOUS <span class="p"
						>– The laws of the State of New York shall govern this Agreement and it shall be
						interpreted in accordance with those laws. This Agreement is subject to the Securities
						Exchange Act of 1934, the rules promulgated under that act, and the joint-industry plans
						entered into pursuant to that act. This writing contains the entire agreement between
						the parties in respect of its subject matter. Subscriber may not assign all or any part
						of this Agreement to any other person. The person executing this Agreement below
						represents and warrants that he or she has legal capacity to contract and, if that
						person is executing this Agreement on behalf of a proprietorship or a business,
						partnership or other organization, represents and warrants that he or she has actual
						authority to bind the organization.</span
					>
				</h2>
				<p style="padding-top: 3pt;padding-left: 5pt;text-indent: 71pt;text-align: left;">
					ACCEPTED AND AGREED: I, the &quot;Subscriber&quot; to which the preceding terms and
					conditions refer, acknowledge that I have read the preceding terms and conditions of this
					Section 1, that I understand them and that I hereby manifest my assent to, and my
					agreement to comply with, those terms and conditions by &quot;clicking&quot; on the
					following box:
				</p>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<p style="padding-left: 211pt;text-indent: 0pt;text-align: left;" />
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<TextField name="section-1" checkbox />
				<p
					class="s2"
					style="padding-top: 4pt;padding-left: 41pt;text-indent: 0pt;text-align: left;"
				>
					SECTION 2: NONPROFESSIONAL SUBSCRIBER
				</p>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="9.">
				<h2 style="padding-top: 4pt;padding-left: 87pt;text-indent: -46pt;text-align: left;">
					NONPROFESSIONAL SUBSCRIBER DEFINITION -<span class="p">&quot;Nonprofessional</span>
				</h2>
				<p style="padding-left: 5pt;text-indent: 0pt;text-align: justify;">
					Subscriber&quot; means any natural person who receives market data solely for his/her
					personal, non-business use and who is not a “Securities Professional.” A “Securities
					Professional” includes an individual who, if working in the United States, is:
				</p>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<ol id="l2">
					<li data-list-text="(a)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							registered or qualified with the Securities and Exchange Commission (the
							&quot;SEC&quot;), the Commodities Futures Trading Commission, any state securities
							agency, any securities exchange or association, or any commodities or futures contract
							market or association.
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(b)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							engaged as an &quot;investment advisor&quot; as that term is defined in Section 202
							(a) (11) of the Investment Advisor&#39;s Act of 1940 (whether or not registered or
							qualified under that Act), or
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(c)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							employed by a bank or other organization exempt from registration under Federal and/or
							state securities laws to perform functions that would require him or her to be so
							registered or qualified if he or she were to perform such functions for an
							organization not so exempt.
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
						<p style="padding-left: 5pt;text-indent: 0pt;text-align: justify;">
							A person who works outside of the United States will be considered a “Securities
							Professional” if he or she performs the same functions as someone who would be
							considered a “Securities Professional” in the United States.
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
						<p style="padding-left: 5pt;text-indent: 0pt;text-align: justify;">
							Subscriber may not receive Market Data as a “Nonprofessional Subscriber” unless the
							vendor providing that data to Subscriber first determines that the individual falls
							within Paragraph 9’s definition of “Nonprofessional Subscriber.”
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
				</ol>
			</li>
			<li data-list-text="10.">
				<h2 style="padding-left: 5pt;text-indent: 35pt;text-align: justify;">
					PERMITTED RECEIPT <span class="p"
						>- Subscriber may not receive Market Data from Vendor, and Vendor may not provide Market
						Data to Subscriber, on a “Nonprofessional Subscriber” basis unless Vendor first properly
						determines that Subscriber qualifies as a “Nonprofessional Subscriber” as defined in
						Paragraph 9 and Subscriber in fact qualifies as a “Nonprofessional Subscriber.” In
						determining whether a Subscriber qualifies as a “Nonprofessional Subscriber,” Vendor
						shall consider whether Subscriber would answer “No” to</span
					>
				</h2>
				<p style="padding-top: 3pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">
					the following questions:
				</p>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<ol id="l3">
					<li data-list-text="(a)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							Do you receive Market Data for any reason other than your personal, non-business use?
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(b)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: left;">
							Are you currently registered or qualified with the SEC or the CFTC?
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(c)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							Are you currently registered or qualified with any securities agency, any securities
							exchange, association or regulatory body, or any commodities or futures contract
							market, association or regulatory body, in the United States or elsewhere?
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(d)">
						<p class="s3" style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							<span class="p"
								>Whether you are located within or outside of the United States, do you perform any
								functions that are similar to those that require an individual to register or
								qualify with the SEC, the CFTC, any other securities agency or regulatory body, any
								securities exchange or association, or any commodities or futures contract market,
								association or regulatory body?</span
							>
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(e)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: left;">
							Are you engaged to provide investment advice to any individual or entity?
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(f)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: left;">
							Are you engaged as an asset manager?
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(g)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							Do you use the capital of any other individual or entity in the conduct of your
							trading?
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(h)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							Do you conduct trading for the benefit of a corporation, partnership, or other entity?
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(i)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							Have you entered into any agreement to share the profit of your trading activities or
							receive compensation for your trading activities?
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
					<li data-list-text="(j)">
						<p style="padding-left: 77pt;text-indent: -36pt;text-align: justify;">
							Are you receiving office space, and equipment or other benefits in exchange for your
							trading or work as a financial consultant to any person, firm or business entity?
						</p>
						<p style="text-indent: 0pt;text-align: left;"><br /></p>
					</li>
				</ol>
			</li>
			<li data-list-text="11.">
				<h2 style="padding-left: 5pt;text-indent: 35pt;text-align: left;">
					PERMITTED USE <span class="p"
						>– If Subscriber is a Nonprofessional Subscriber, he or she shall receive Market Data
						solely for his or her personal, non-business use.</span
					>
				</h2>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="12.">
				<h2 style="padding-left: 5pt;text-indent: 35pt;text-align: left;">
					PERSONAL AND EMPLOYMENT DATA <span class="p"
						>– As a prerequisite to qualifying as a &quot;Nonprofessional Subscriber&quot;,
						Subscriber shall provide the following information:</span
					>
				</h2>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<p style="padding-bottom: 1pt;padding-left: 41pt;text-indent: 0pt;text-align: left;">
					Subscriber&#39;s name and address:<br />
					<TextField name="subscriber-name-address" />
				</p>
				<p style="padding-left: 41pt;text-indent: 0pt;text-align: left;" />
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<p style="padding-left: 41pt;text-indent: 0pt;text-align: left;">
					Subscriber&#39;s occupations (list all occupations – including homemaker, student,
					retiree, etc.):<br />
					<TextField name="subscriber-occupations" />
				</p>
				<p style="padding-left: 41pt;text-indent: 0pt;text-align: left;" />
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<p
					style="padding-top: 4pt;padding-bottom: 1pt;padding-left: 41pt;text-indent: 0pt;text-align: left;"
				>
					Name(s) and address(es) of Subscriber&#39;s employer(s):<br />
					<TextField name="employer-name-address" />
				</p>
				<p style="padding-left: 41pt;text-indent: 0pt;text-align: left;" />
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<p style="padding-left: 41pt;text-indent: 0pt;text-align: left;">
					Subscriber&#39;s title(s) and/or position(s):<br />
					<TextField name="title-and/or-position" />
				</p>
				<p style="padding-left: 41pt;text-indent: 0pt;text-align: left;" />
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<p style="padding-left: 41pt;text-indent: 0pt;text-align: left;">
					Subscriber&#39;s employment functions (description):<br />
					<TextField name="employment-functions" />
				</p>
				<p style="padding-left: 41pt;text-indent: 0pt;text-align: left;" />
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
				<p style="padding-left: 5pt;text-indent: 0pt;text-align: left;">
					Subscriber shall notify Vendor promptly in writing of any change in his or her
					circumstances that may cause him or her to cease to qualify as a Nonprofessional
					Subscriber or that may change his or her response to any of the preceding questions.
				</p>
				<p style="text-indent: 0pt;text-align: left;"><br /></p>
			</li>
			<li data-list-text="13.">
				<h2 style="padding-left: 5pt;text-indent: 0pt;line-height: 114%;text-align: left;">
					CERTIFICATION <span class="p"
						>– By executing this Agreement, Subscriber hereby certifies that he or she falls within
						Paragraph 9&#39;s definition of &quot;Nonprofessional Subscriber&quot; and that the
						personal and employment information that he or she has included in Paragraph 12 is
						truthful and accurate.</span
					>
				</h2>
			</li>
		</ol>
		<TextField name="non-professional-subscriber-certification" checkbox />
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<p style="padding-left: 211pt;text-indent: 0pt;text-align: left;" />
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<p style="padding-left: 5pt;text-indent: 71pt;text-align: justify;">
			ACCEPTED AND AGREED: I, the &quot;Subscriber&quot; to which the preceding terms and conditions
			refer, acknowledge that I have read the preceding terms and conditions of this Section 2, that
			I understand them, that I answer “No” to the questions set forth in Section 10, and that I
			hereby manifest my assent to, and my agreement to comply with, those terms and conditions by
			&quot;clicking&quot; on the following box:
		</p>

		<TextField name="section-2" checkbox />
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<p style="padding-left: 211pt;text-indent: 0pt;text-align: left;" />
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<p style="text-indent: 0pt;text-align: left;"><br /></p>
		<p style="padding-left: 5pt;text-indent: 0pt;text-align: left;">
			* <span class="h1">NYSE is the administrator for NYSE Prop, CTA, and GIF products</span>
		</p>

		<button class="submit" type="submit">Submit</button>
	</form>
</main>

<style type="text/css">
	* {
		margin: 0;
		padding: 0;
		text-indent: 0;
		background-color: white;
	}
	.submit {
		margin-top: 2rem;
		width: 80vw;
		padding: 5px;
		background-color: black;
		color: white;
	}
	.layout {
		width: 80vw;
		/* display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center; */
		/* margin: auto; */
		/* text-align: left; */
	}
	.agreemet-container {
		background-color: white;
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	h2 {
		color: black;
		font-family: 'Times New Roman', serif;
		font-style: normal;
		font-weight: bold;
		text-decoration: none;
		font-size: 11pt;
	}
	.s1 {
		color: black;
		font-family: 'Times New Roman', serif;
		font-style: normal;
		font-weight: normal;
		/* text-decoration: underline; */
		font-size: 11pt;
	}
	.p,
	p {
		color: black;
		font-family: 'Times New Roman', serif;
		font-style: normal;
		font-weight: normal;
		text-decoration: none;
		font-size: 11pt;
		margin: 0pt;
	}
	.s2 {
		color: black;
		font-family: 'Times New Roman', serif;
		font-style: normal;
		font-weight: bold;
		text-decoration: underline;
		font-size: 11pt;
	}
	.s3 {
		color: black;
		font-style: normal;
		font-weight: normal;
		text-decoration: none;
	}
	.h1 {
		color: black;
		font-family: 'Times New Roman', serif;
		font-style: normal;
		font-weight: bold;
		text-decoration: none;
		font-size: 12pt;
	}
	li {
		display: block;
	}
	#l1 {
		padding-left: 0pt;
		counter-reset: c1 1;
	}
	#l1 > li > *:first-child:before {
		counter-increment: c1;
		content: counter(c1, decimal) '. ';
		color: black;
		font-family: 'Times New Roman', serif;
		font-style: normal;
		font-weight: bold;
		text-decoration: none;
		font-size: 11pt;
	}
	#l1 > li:first-child > *:first-child:before {
		counter-increment: c1 0;
	}
	#l2 {
		padding-left: 0pt;
		counter-reset: c2 1;
	}
	#l2 > li > *:first-child:before {
		counter-increment: c2;
		content: '(' counter(c2, lower-latin) ') ';
		color: black;
		font-style: normal;
		font-weight: normal;
		text-decoration: none;
	}
	#l2 > li:first-child > *:first-child:before {
		counter-increment: c2 0;
	}
	#l3 {
		padding-left: 0pt;
		counter-reset: c2 1;
	}
	#l3 > li > *:first-child:before {
		counter-increment: c2;
		content: '(' counter(c2, lower-latin) ') ';
		color: black;
		font-style: normal;
		font-weight: normal;
		text-decoration: none;
	}
	#l3 > li:first-child > *:first-child:before {
		counter-increment: c2 0;
	}
</style>

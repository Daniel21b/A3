Assignment 3: White Hat/Black Hat Visualization
CMSC471: Introduction to Information Visualization (Spring 2025)
Due: April 4, 2025, 11:59 PM EST

Submission:

Webpage: Your two visualizations and write-up.
Demo link: URL submitted to Canvas-ELMS.
Video: A brief demo video submitted to Canvas-ELMS.
Group policy: 2-3 students.

Collaboration is an essential part of learning, and group work helps develop the communication and teamwork skills crucial for your future career. Working solo may limit these learning opportunities, so a 10% penalty (-12 pts) will be applied unless you provide a compelling reason with supporting evidence. Note that difficulties with team management alone do not qualify as a valid justification.

Introduction
It is tempting to think of data and data visualization as a neutral actor. An emphasis on a minimalist aesthetic — particularly through the use of clean, precise geometric lines — lends an air of objective, transparent reporting that masks visualization’s persuasive power. Given the growing ubiquity of visualization as a medium for recording, analyzing, and communicating data, we have a responsibility to examine how our design choices can influence the way a visualization is read, and what insights a reader walks away with.

What you’ll do
In this assignment, we will grapple with these ethical concerns by visualizing a single dataset from two different perspectives: the “white hat” and the “black hat.” These terms originated in the symbolism used by early Western (genre) movies: the heroes wore white hats, and the villains wore black hats. This trope continues to be used in visual media today, and the terms have also been adopted in computer security to refer to two different kinds of hackers: a white hat hacker uses their skills for good (e.g., to uncover vulnerabilities in software to draw attention to and fix the issue), whereas a black hat hacker violates computer security for malicious ends (e.g., their own personal gain).

For this assignment, we will consider a white hat visualization to be one where:

The visualization is clear and easy to interpret for the intended audience (often the general population)
Any data transformations (e.g., filters, additional computations, etc.) are clearly and transparently communicated.
The sources of the data, including potential bias, is communicated.
A black hat visualization, on the other hand, exhibits one or several of the following characteristics:

The visual representation is intentionally inappropriate, overly complex and/or too cluttered for the audience

Labels, axes, and legends are misleading; or titles are skewed to intentionally influence the viewer’s perception.
The data has been transformed, filtered, or processed in an intentionally misleading way.
The visual encodings are intentionally misleading.
The dataset is cherrypicking.
Although we might never imagine ourselves to be (nor aspire to be) black hat hackers, we are going to temporarily don this hat to better appreciate the extent of the rhetorical force of visualization, and build our critical reading skills.

You will be working with a single dataset: choose one from the datasets listed below. These datasets are intentionally chosen to cover politically charged topics as these are typically the type of data where ethical visualization is important. Note that you do not have to visualize the entire dataset (i.e., you may choose a subset of the data to visualize) and that your two visualizations can focus on different aspects of the data.

The datasets are the following:

Greenhouse Gas Emissions 1990–2018. The Organization for Economic Co-operation and Development (OECD) has compiled data for the emissions of all participating countries broken out by the pollutant (e.g., carbon monoxide, methane, etc.) and by different sources (e.g., energy, agriculture, etc.). The linked interface can be a little difficult to use, but you can access various slices of the data by either choosing alternate themes in the left-hand side menu, or by customizing the pollutants and variables in the dropdown menus in the main view.

Gender Equality Indicators 1960–2017. The World Bank tracks a number of different measures including fertility rate, literacy, employment and ownership of businesses, and wages to study the extent of gender equality around the world. The linked dataset curates a smaller subset of the overall set of gender indicators which you are welcome to use as well.

Civilian Complaints Against New York City Police Officers. This is a dataset compiled by ProPublica, an independent, nonprofit investigative journalism newsroom. It contains more than 12,000 civilian complaints filed against the NYPD, with demographic information about the complainant and officer, the category of the alleged misconduct, and the result of the complaint.

Gentrification and Demographic Analysis. This is a dataset compiled by BuzzFeed News to understand gentrification, or how the character and demographics of neighborhoods change as more affluent people and business move in and potentially displace existing residents. The process of data collection, cleaning, and analysis is well-documented by the BuzzFeed News team, and be sure to read the accompanying article which contains important context and details.

Required elements
1. Two visualizations
You will create two contrasting visualizations:

White hat: Focused on clear communication, transparency, and accuracy.
Black hat: Uses misleading techniques such as selective filtering, distorted scales, or deceptive encodings.
Each visualization may consist of one or multiple small views. You can use any tool (D3.js, Vega, Tableau, Matplotlib, Illustrator, etc.). Consider:

Data transformation: Aggregation, filtering, sorting, scaling.
Encodings: Color, size, position, labels, axes, scales.
Annotations: Titles, legends, tooltips, captions.
2. Write-ups on your webpage
Create a webpage for the two visualizations (they could be images). For each visualization, provide a short write-up (e.g., 200-500 words per visualization):

White hat: Describe your dataset, design choices, and how your visualization ensures clarity and accuracy.
Black hat: Explain the manipulative techniques used and how they distort perception.
Additionally, include a section discussing AI usage if applicable.

3. Public webpage
Deploy your visualization on a publicly accessible webpage. Your webpage could be a Tableau dashboard. There are several ways to do this—the easiest is to use GitHub to host your project repository (see https://pages.github.com/; see Assignment 2). Your page should include:

Both visualizations. Web implementation, images, or Tableau dashboard.
The write-up for each visualization.
References to data resources. Be sure to list the data source you used. If your work adapts or builds on existing visualization examples, please cite those as well.
An overview of your development process. Describe how the work was split among the team members. Include a commentary on the development process, including answers to the following questions: Roughly how much time did you spend developing your application (in people-hours)? What aspects took the most time?
4. Record a demo video
The main purpose of this video is to provide a timestamp for your project demo (to prevent major changes after the deadline). It doesn’t need to be polished or have a professional voiceover, but it should be short (a few minutes), functional, and clearly showcase the visualizations you’ve implemented. A casual voiceover is encouraged but not required. Minor discrepancies between the video and your demo, such as typos, are acceptable.

Grading rubric
The assignment score is out of a maximum of 120 points, evenly divided between white hat (60 points) and black hat (60 points). Submissions that squarely meet the requirements (i.e., the average of “Satisfactory” column in the rubric below) will receive 80%. We will determine scores by judging the clarity of your white hat visualization, the subtle deceptiveness of your black hat visualization, and the quality of the associated write-ups. Missing the webpage URL or video results in a 50% penalty.

Hat	Component	Excellent	Satisfactory	Poor
White	Marks & Encodings	All design choices are effective. The visualization can be read and understood effortlessly.	Design choices are largely effective, but minor errors hinder comprehension.	Ineffective mark or encoding choices are distracting or potentially misleading.
White	Data Transformation	More advanced transformations (e.g., additional calculations, aggregations) were used to extend the dataset in interesting or useful ways.	Simple transforms (e.g., sorting, filtering) were primarily used.	The raw dataset was used directly with little to no additional transformation.
White	Titles & Labels	Titles and labels helpfully describe and contextualize the visualization.	Most necessary titles and labels are present, but they could provide more context.	Many titles or labels are missing, or do not provide human-legible information.
White	Write-Up	Your write up is well-crafted and provides reasoned justification for all design choices.	Most design decisions are described, but rationale could be explained at a greater level of detail.	Missing or incomplete. Several design choices are left unexplained.
Black	Deceptiveness	Visualization is misleading in at least 2 out of these 3 categories: marks/encodings, data transformation, titles/labels.	Visualization is misleading in only 1 of these 3 categories: marks/encodings, data transformation, titles/labels.	No black hat techniques were used.
Black	Subtlety	The black-hat techniques used are very subtle and need close study to be identified even by seasoned visualization readers.	The black-hat techniques cannot be detected at first glance but are still somewhat easy to identify.	The black-hat techniques could be immediately identified.
Black	Visualization Design (marks, encodings, data transformations, title & labels)	Aspects of the visualization design make it appear interesting and possibly trustworthy.	An acceptable quality of visualization design. However, some aspects do not help convince the reader of its trustworthiness.	Poor quality of visualization design does not convince the reader that the visualization is trustworthy. E.g., certain elements such as titles or legends are missing altogether.
Black	Write-Up	Your write up is well-crafted and provides reasoned justification for all design choices, and especially the black-hat techniques you used.	Most design decisions are described, but rationale could be explained at a greater level of detail.	Missing or incomplete. Several design choices are left unexplained.
In addition, we award up to 10% extra credit for:

A particularly engaging or creative design.
Exceptional graphic design.
Checklist
 Register your team on Canvas (use Assignment 3 groups).
 Choose a compelling dataset and subset.
 Create two visualizations: one white hat, one black hat.
 Provide a short write-up (e.g., 200-500 words per visualization).
 Publish your work on a public webpage.
 Submit your webpage URL to Canvas-ELMS.
 Submit a demo video to Canvas-ELMS.

Tips and examples
In past years, we’ve had many questions about what constitutes a “black hat” technique and how obvious it needs to be. Indeed, it’s a tricky balancing act. For instance “black hattedness” is not a strictly monotonic function as you can raise a reader’s suspicion by using too many black hat techniques all at once, by making outright mistakes, or by making the misleading intent too obvious to the reader. Similarly, having an unclear (or no) data question, or omitting titles, axes, or legends are more likely to hinder a reader’s overall ability to read or make sense of a visualization rather than mislead them or slant the message.

Here are additional resources

Black Hat Visualization by Michael Correll and Jeffrey Heer
How to Lie with Data Visualization by Ravi Parikh
Data Visualization: How Visualizations Lie by Alberto Cairo
Visualization Rhetoric: Framing Effects in Narrative Visualization by Jessica Hullman and Nicholas Diakopoulos
V-FRAMER: Visualization Framework for Mitigating Reasoning Errors in Public Policy by Lily Ge et al.
Publish a Tableau dashboard
The Tableau tutorial shows your how to make a dashboard (Step 6) https://help.tableau.com/current/guides/get-started-tutorial/en-us/get-started-tutorial-connect.htm.

If you are using the online version
First click on “Publish”.
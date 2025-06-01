

**OweNus README**

**Milestone 1**

Chellappan Ramiah, A0303162W, Year 1 Computer Science  
Sanfo Bimal Thomas, A0309330N, Year 1 Computer Science

**Contents**

**[1 Proof-of-Concept	3](#1-proof-of-concept)**

[**2 Motivation	3**](#2-motivation)

[**3 Aim	6**](#3-aim)

[**4 User Stories	7**](#4-user-stories)

[**5 Features	7**](#heading=h.qmr4a3g9ys31)

[5.1 Job Board	7](#heading=h.xud5zciqvz24)

[5.2 Guild/ Hall Master	8](#heading=h.rgk2z9s1m93b)

[5.3 Training Facilities	8](#heading=h.hya7r3kg5qrk)

[5.4 Discussion Hall	9](#heading=h.s19qdrq1evx2)

[5.5 Registration Desk	10](#heading=h.1k1qx7i7q568)

[5.6 Information Network	11](#heading=h.77ryetdf68ab)

[5.7 Adventure Team formation	11](#heading=h.5xc834ggdtnr)

[5.8 Verification	12](#heading=h.f7zvbclwzx7e)

[5.9 Skill Tree, Achievement and Awards	13](#heading=h.e03qs8spkghe)

[**6 Timeline and Development Plan	14**](#6-timeline-and-development-plan)

[6.1 Timeline	14](#6.1-timeline)

[6.2 Work Log	14](#6.2-work-log)

[6.3 Planned API endpoints	15](#heading=h.w0h3ibk27o44)

[6.4 Planned Pages	16](#6.3-planned-pages)

[**7 Tech Stack	17**](#7-tech-stack)

[7.1 Design and Prototyping	17](#heading=h.89ddortq7hhv)

[7.2 Frontend Development	17](#7.2-frontend-development)

[7.3 Backend Development	18](#7.3-backend-development)

[7.4 Authentication and Database	18](#7.4-authentication-and-database)

[7.5 Version Control and Collaboration	18](#7.5-version-control-and-collaboration)

[7.6 Deployment	18](#heading=h.4po4jcj7g5ef)

[**8 System Design	20**](#8-system-design)

[8.1 User Interface Design	20](#8.1-user-interface-design)

[8.2 Entity Relationship Diagram	21](#heading=h.hxtfyevc0fd4)

[**9 Project Scope	22**](#9-project-scope)

[9.1 Milestone 1: Completed Actions	22](#9.1-milestone-1:-completed-actions)

[9.2 Milestone 2: To Be Implemented	26](#9.2-milestone-2:-to-be-implemented)

## **1	Proof-of-Concept** {#1-proof-of-concept}

It currently has the following implemented functions:

- [x] Sign-up and sign-in with 3rd-party accounts (email not supported yet)  
- [x] Viewing the Dashboard page  
- [x] Making Payments from one User to another User  
- [x] Topping Up own account  
- [x] Splitting Expenses for a group equally

## 

## 

## 

## 

## 

## 

## 

## 

## 

## 

      *Login and Sign Up Pages*

## 

## **2	Motivation** {#2-motivation}

As undergraduate students at the National University of Singapore (NUS), many of us have faced situations where financial flexibility becomes essential—whether it’s managing day-to-day expenses, covering unexpected costs, or funding a personal project. In such situations, borrowing money from friends often becomes a practical and convenient solution. While friend-to-friend lending is rooted in trust and mutual support, it can sometimes lead to misunderstandings, delayed repayments, or even strained relationships when agreements are not clearly defined or honored.

Existing tools like Splitwise help track shared expenses, but they have limitations—such as daily caps on the number of expenses that can be added, and a lack of features for managing structured lending agreements or tracking repayment timelines. They were not built for actual lending workflows or financial accountability between individuals.

To address these gaps, we propose a decentralized peer-to-peer (P2P) lending platform built on blockchain technology. Our solution preserves the trust and familiarity of borrowing from friends, while adding smart contracts for enforceable, transparent agreements. Additionally, we aim to go beyond expense tracking by integrating AI-powered insights—offering users personalized reminders, repayment predictions, spending habit analysis, and risk alerts to enhance trust and financial awareness.

Our platform empowers students to lend and borrow in a secure, transparent, and scalable manner—combining the warmth of a handshake deal with the accountability of a formal system.

## 

## **3	Aim** {#3-aim}

Our primary goal is to revolutionize the way individuals and groups manage shared expenses and personal loans by building a decentralized peer-to-peer (P2P) lending and expense management platform powered by blockchain technology. Unlike traditional tools that offer only basic tracking functionality, our platform is designed to provide a holistic, trust-based financial ecosystem tailored to real-world social and financial dynamics.

At its core, the platform will allow users to seamlessly coordinate and split expenses within groups, monitor pending payments, and reduce friction in repayments. A unique feature will be our credibility score system, which evaluates users based on payment punctuality and consistency. This scoring mechanism not only incentivizes responsible financial behavior but also fosters greater trust and accountability among peers—laying the groundwork for more dependable financial interactions.

To further enhance the user experience, the platform will go beyond expense tracking. It will include smart automation tools such as customizable deadlines and automated reminders, AI-driven expense prediction based on past behavior, and personalized financial insights that help users align their spending with income patterns. These intelligent features empower users to take proactive control of their finances, anticipate upcoming obligations, and plan smarter—ultimately reducing the cognitive burden and stress often associated with informal lending and shared money matters.

By combining the transparency and security of blockchain with user-centric design and intelligent automation, our platform aspires to redefine trust, efficiency, and accountability in everyday financial relationships.

## 

## **4	User Stories** {#4-user-stories}

1. As a student, I can borrow small amounts of money through the platform with transparent terms, so that I don’t have to rely on informal borrowing or risk misunderstandings with friends.

2. As a student, I can lend money to peers with a smart contract-based agreement, so that I have confidence I’ll be repaid on time.

3. As a user, I can track all group expenses in one place, so that I don’t lose track of who owes what across multiple social settings.

4. As a user, I can receive timely reminders about upcoming repayments, so that I can avoid late payments and maintain my credibility score.

5. As a borrower, I can view my credibility score and see how it's affected by my repayment behavior, so that I understand how others view my reliability.

6. As a user, I can view predictive analytics about my spending habits and upcoming obligations, so that I can make better financial decisions.

7. As a group member, I can split both recurring and one-time expenses, so that our financial coordination remains seamless and fair.

8. As a financially responsible student, I can build a public credibility history, so that I can eventually use it to access larger or more trusted loans.

9. As a platform user, I can resolve disputes or clarify repayments using immutable records on the blockchain, so that misunderstandings don’t escalate into conflicts.

   

### **5	Features**

#### **5.1	Personalized Expense Splitter**

## The Personalized Expense Splitter is a core feature designed to automate and simplify shared expense management within groups. Users can split bills and shared costs using various models such as equal division, income-weighted proportions, or custom allocations. The system adapts to each group’s dynamics, removing the need for manual calculations and promoting fairness and transparency. Its intuitive interface ensures that users can quickly settle costs, whether for daily expenses, trips, or recurring group activities.

#### **5.2	Real-Time Pending Payment Tracker**

## The Real-Time Pending Payment Tracker offers users a live dashboard of outstanding debts and dues, categorized by individuals and groups. Visual indicators show payment statuses, due dates, and settlement progress. With smart notifications, the system ensures that no dues go unnoticed, helping users stay on top of their financial obligations.

#### **5.3	Credibility Score Generator**

## To foster trust in peer-to-peer lending, the Credibility Score Generator evaluates each user's payment behavior. By leveraging immutable blockchain records, the system calculates scores based on punctuality, consistency, dispute history, and transaction volumes. This score helps users make informed decisions about whom to lend to or borrow from, encouraging financial responsibility and reducing risk.

#### **5.4	Payment Deadlines and Reminders**

## Users can set custom payment deadlines when splitting bills or issuing loans. Automated reminders are sent via push notifications or email before due dates. This reduces the likelihood of forgotten payments, making the repayment process seamless and timely.

#### **5.5	Expense Predictor**

## The Expense Predictor uses AI to analyze historical transactions and identify patterns in user spending. Based on these trends, it forecasts upcoming expenses, helping users anticipate financial needs and prepare accordingly. This feature supports better budgeting, especially for students or freelancers managing irregular income.

#### **5.6	Expense Time Boxer**

## This tool structures user expenses by aligning them with income cycles and priority levels. Users can categorize expenses (e.g., rent, food, entertainment) and allocate timeframes for their payments. This promotes discipline and helps avoid clustering multiple payments around financially tight periods.

#### **5.7	Group Lending Pools**

## Group Lending Pools enable users to form informal lending groups, formalized using smart contracts. Members contribute to a common pool, define terms like repayment schedules and interest rates, and vote on loan approvals. This creates a decentralized version of traditional chit funds, backed by transparency, automation, and credibility scoring.

#### **5.8	Dispute Resolution Hub**

## To manage conflicts, this hub allows users to raise disputes related to unpaid loans or misrepresented expenses. Users can upload supporting evidence (e.g., chat logs, payment proofs), and a mediated arbitration system facilitates fair outcomes. Final resolutions affect users' credibility scores, ensuring accountability.

#### **5.9	Financial Behavior Insights Dashboard**

## Using TensorFlow Lite, the platform analyzes on-chain transaction history and spending behavior to generate personalized insights. The dashboard highlights user-specific trends and offers micro-savings strategies, such as suggesting reduced spending in certain categories or better loan repayment schedules. These insights are actionable and designed to promote smarter financial decisions.

#### **5.10	Scalability and AI Enhancements**

## While current platforms like Splitwise limit the number of daily transactions, OweNUS is built for scalability from the ground up. We overcome these constraints by leveraging a decentralized architecture and real-time syncing. With the integration of AI-powered insights, OweNUS goes beyond simple expense tracking to become a full-fledged financial co-pilot for students and small communities alike.

## Each feature within OweNUS is intentionally designed to blend user-friendliness with financial intelligence, ensuring that shared expenses and personal lending are no longer sources of friction but catalysts for collaboration and trust.

## 

## **6	Timeline and Development Plan** {#6-timeline-and-development-plan}

### **6.1	Timeline** {#6.1-timeline}

| Week | Period | Description | Remark |
| :---: | :---: | :---- | :---- |
| **Pre-Week 1** | Before 13 May | Tech Stack Familiarisation (React, Firebase) |  |
| **1** | 13 May \- 20 May | **Week 1 Goals:** Team Advisor Consultation Liftoff Preparation \- Poster and Video Technical Proof of Concept Implement Authentication Identify features, break them down into milestones, then issues Mentor Matching Implement Sign In/ Sign Up Feature | Liftoff Week |
| **2** | 20 May \- 27 May | **Week 2 Goals:** Plan out system design and make wireframe Navigation system in code Plan features: Expenses, TopUp, Transfer |  |
| **3** | 27 May \- 3 June | **Week 3 Goals:** Read up on CS2103 documentation Identify epics (features, break them down to milestones and issues) Plan out system design and make wireframe Feature: Dashboard, Expenses, TopUp, Transfer UI design for Dashboard | 3 June \- Milestone 1 \- Ideation |

### **6.2	Work Log** {#6.2-work-log}

### 

Our work log documents the hours spent and tasks done by our individual teammates: [OweNus WorkLog](https://github.com/users/san4b0t/projects/1/views/1)

### 

### 

### 

### 

### 

### **6.3	Planned Pages** {#6.3-planned-pages}

Here are the pages we plan to show to our users in OweNUS:

| Log In | Sign-in / sign-up methods |  |
| :---- | :---- | :---- |
| **Sign Up Page** | New user registration |  |
| **Dashboard** | Page directing to all features |  |
| **Information Network** | News feed, chronological Display selected event / news Submit news and updates Discussion hall integration (popup, or page fragment etc) (Personalized news feed) |  |
| **Discussion Hall** | All discussions feed (like Reddit home page) Community page Selected post page Compose post / comment (Report post / comment) |  |
| **Quest / Job Board** | List of opportunities Saved / applied opportunities More information on selected opportunity Apply for opportunity Discussion hall integration to team up |  |
| **User Profile** | User info User skill tree Settings 3rd party integrations (Certifications) |  |

## **7	Tech Stack** {#7-tech-stack}

The development of OweNus involved the use of the following technology stack:

| Design, Prototyping | Figma |
| :---- | :---- |
| **Frontend** | React Native, Expo, Typescript |
| **Backend** | FireBase |
| **Authentication, Database** | FireBase, FireStore |
| **CI/CD, Version Control** | Git, GitHub |

Here are the justifications for going with these tools and frameworks:

---

### **7.1 Design and Prototyping**

The foundation of our development journey was laid through a rigorous design and prototyping phase. This stage was crucial in aligning our vision, refining user flows, and ensuring a cohesive user experience across the platform. We prioritized collaborative ideation, rapid iteration, and visual clarity to ensure the platform would be intuitive, user-friendly, and scalable.

Figma served as our primary design and prototyping tool, enabling real-time collaboration across team members, regardless of location. It allowed us to:

* Develop low and high-fidelity wireframes that mapped out every screen and interaction.

* Create interactive prototypes that simulated user journeys, helping us validate usability and gather early feedback.

* Implement design systems and reusable components, ensuring visual consistency and reducing redundancy as the project scaled.

* Streamline collaboration with seamless feedback loops between designers, developers, and stakeholders. Changes could be communicated and updated instantly, speeding up the iteration cycle.

This design-first approach ensured that we built not only a functional product, but one that was also thoughtfully crafted around user needs and behaviors. By thoroughly prototyping before development, we were able to reduce technical debt, improve time-to-implementation, and lay the groundwork for a polished and responsive interface.

### **7.2	Frontend Development** {#7.2-frontend-development}

Our frontend development focused on creating an intuitive and visually appealing user experience. Here’s how we achieved it:

* React: We chose React as our frontend library due to its flexibility, component-based architecture, and strong community support. React enabled us to build dynamic and responsive user interfaces. In addition, React enabled us to build Progressive Web Apps (PWA), which are websites that are also installable as lightweight apps on all platforms, regardless of operating system and device type.

* Typescript: By using TypeScript, we enhanced code quality and caught potential errors early. Its static typing system made our development more robust.

### **7.3	Backend Development** {#7.3-backend-development}

The backend of OweNUS was powered by Firebase, a comprehensive Backend-as-a-Service (BaaS) platform developed by Google. Here's why we chose Firebase:

* **Firebase:**  
   Firebase enabled us to build a serverless backend quickly and efficiently, ideal for a lightweight, mobile-friendly financial app like OweNUS. With Firebase Authentication, we securely managed user login and identity. Cloud Firestore, a real-time NoSQL database, allowed us to store transactions, user profiles, and expense data with low latency and automatic syncing across devices. Additionally, Cloud Functions let us execute server-side logic—such as sending payment reminders or updating credibility scores—without provisioning or managing our own servers. Firebase’s scalability and real-time capabilities made it a natural fit for building a responsive and user-centric platform.

### **7.4	Authentication and Database** {#7.4-authentication-and-database}

Managing user authentication and data storage required robust tools. We chose Supabase for these critical components:

* **Firebase & Firestore:**  
   Firebase is a comprehensive app development platform backed by Google, offering a wide range of services such as authentication, analytics, and real-time databases.  
* One of its core components, Firestore, is a scalable, flexible NoSQL cloud database designed for real-time applications. Firestore enables us to store and sync data across users and devices efficiently, making it ideal for collaborative or live-update scenarios. Its tight integration with Firebase Authentication and robust security rules allows for secure, user-centric data management.

### **7.5	Version Control and Collaboration** {#7.5-version-control-and-collaboration}

Efficient collaboration and version control were essential for our development workflow:

* Git and GitHub: Git served as our version control system, allowing us to track changes, collaborate seamlessly, and manage codebase history. GitHub provided a platform for code reviews, pull requests, and team coordination.

* Visual Studio Code (VS Code): We used VS Code, a popular code editor, along with the GitHub extension. This combination streamlined our development process, making it easy to commit, push, and manage branches.

## **8	System Design** {#8-system-design}

### **8.1	User Interface Design** {#8.1-user-interface-design}

Our UI design for OweNUS embraces a sleek, futuristic aesthetic that reflects the app’s modern and tech-driven approach to managing group expenses. We use clean lines, vibrant gradients, and intuitive layouts to create a visually engaging and easy-to-navigate interface. The design prioritizes clarity and efficiency, helping users quickly access their balances, transactions, and key features without any clutter. This forward-looking style not only makes the app feel fresh and innovative but also reinforces OweNUS’s goal of simplifying financial interactions with cutting-edge technology.

## **9	Project Scope** {#9-project-scope}

### **9.1	Milestone 1: Completed Actions** {#9.1-milestone-1:-completed-actions}

| Set up GitHub repository | [https://github.com/san4b0t/OweNus](https://github.com/san4b0t/OweNus) |
| :---- | :---- |
| **Wireframe planning** | [https://www.figma.com/board/djeZKtZdx4HdzD3aKWN8wm/FigJam-basics?node-id=2843-1086\&t=UPuVgXaiCfhgtoH9-0](https://www.figma.com/board/djeZKtZdx4HdzD3aKWN8wm/FigJam-basics?node-id=2843-1086&t=UPuVgXaiCfhgtoH9-0) |
| **Sign In/ Sign Up Screen** | Implemented Sign In and Sign Up feature |
| **Dashboard Screen** | Implemented Dashboard |
| **Transfers, Topups, Expenses Screens** | Implemented Transfers, TopUps, Expenses Screens |
| **PostgreSQL database setup** | Implemented Profiles, Communities, Posts, Comment tables |

#### **9.1.1	Set Up GitHub Repository**

To facilitate efficient project tracking and streamline development efforts, we have set up a dedicated GitHub repository for OweNUS, available at [GitHub Repository](https://github.com/san4b0t/OweNus). This repository acts as a central collaboration point for our development team, supporting version control and organized feature management. Leveraging GitHub’s powerful tools, we ensure a well-structured workflow that promotes smooth integration of new features, rapid issue resolution, and consistent project updates. The repository plays a vital role in upholding code quality and ensuring uniformity throughout the development process.

We utilized the following features of GitHub:

| Branching | We created branches in our repo to work on different features. Initially, we split our job scope into Frontend and Backend branches; but switched to feature-based branches (e.g. Discussion Hall) later on in development. |
| :---- | :---- |
| **Issues** | As we are working on different features of OweNUS, we will sometimes notice some bugs, areas of improvement or other items that require some work. We document these as issues to come back to later, with attributes of assignees, milestones and types of issues. |
| **Pull Requests** | We used pull requests to merge our feature branches to the Master branch, which is the preferred branch for deployment by Vercel. This method of merging ensures that only intentional code changes are introduced to the most important branch. |
| **Projects** | We utilized GitHub Projects to effectively plan, organize, and track our development tasks throughout the project lifecycle. By creating a structured board with columns for different stages such as “To Do,” “In Progress,” and “Completed” we maintained clear visibility over ongoing work and team responsibilities. This system allowed us to prioritize features, monitor progress in real-time, and ensure timely delivery of key milestones. Using GitHub Projects greatly improved our workflow coordination and helped maintain alignment across the development team.  |

#### **9.1.2	Wireframe Planning**

The wireframe planning for OweNUS was meticulously carried out using digital design tools to create low- and high-fidelity mockups that outline the app’s structure, layout, and user flow. These wireframes serve as a visual blueprint, guiding the development of each screen—from onboarding and dashboard views to expense tracking and payment interfaces. By defining the user journey early in the design process, we ensured a seamless and intuitive experience. The wireframes also helped align the development team on key UI/UX elements and enabled rapid iteration based on feedback. This planning phase was crucial in translating our functional requirements into a cohesive and user-centric design.

#### **9.1.3	Sign In/ Sign Up Page**

We have successfully implemented the Sign In and Sign Up features, which are essential for user authentication and onboarding within the OweNUS platform. These screens enable new users to securely register and existing users to log in using their email credentials, laying the foundation for all personalized interactions within the app. This authentication system ensures that each user's data such as expense records, payment statuses, and group balances—is securely tied to their unique account. Without this functionality, core features like tracking individual payments, splitting expenses, and managing group transactions would not be feasible.

#### **9.1.4	Dashboard Screen**

The OweNUS Dashboard is designed as a centralized space where users can efficiently manage their financial interactions within the app. Upon logging in, users are greeted with a personalized welcome message and a real-time display of their current balance, fetched securely from the Firebase backend.

The dashboard presents a list of recent expenses, showing the description, amount, and the payer, allowing users to stay informed about group activity at a glance. Below this, the Balances section summarizes outstanding dues with each friend, clearly indicating whether the user owes money or is owed by others.

#### **9.1.5	Transfers, Top Ups, Expenses Screens** 

9.1.5.1 Transfers

The Transfers screen in OweNUS makes it easy for users to settle up with their friends. You can select a friend, enter the amount you want to transfer, and confirm the payment—all within a clean, straightforward interface. It also shows how much you currently owe or are owed by that person, so there’s no confusion. Once the transfer goes through, your balances update instantly, keeping everything transparent and up to date.

9.1.5.2 Expenses

On the Add Expense screen, users can log new shared expenses with just a few taps. You can fill in the description, total amount, and who paid for it, then choose how to split the cost—either equally or using custom ratios based on what each person owes. This flexibility is great for real-world situations where not everyone contributes the same amount. Once added, the expense appears in the dashboard and updates the group balances accordingly.

9.1.5.3 Top Ups

The Top Up screen lets users add funds to their virtual balance in the app. Whether you're preparing to make a payment or just want to keep a buffer ready, topping up is simple and intuitive. Users can choose an amount and simulate a top-up (or in future versions, integrate real payments), helping them stay prepared for any group expenses or repayments

**9.1.8 Firebase Database Setup**  
We have successfully implemented the Firebase database setup, establishing a robust and scalable backend foundation for the app. This setup enables seamless user authentication and data management by leveraging Firebase’s secure and real-time capabilities. Each user is now assigned a unique Firebase Authentication ID, allowing us to accurately track and manage individual user data, including their balances, transaction history, and personalized expense details. With this system in place, all user-related operations such as retrieving balances, updating payment statuses, and syncing real-time changes across devices can be handled efficiently and securely. This marks a critical step in ensuring data integrity and personalized functionality throughout the app.

**![][image1]**

### **9.2	Milestone 2: To Be Implemented** {#9.2-milestone-2:-to-be-implemented}

| Current Expenses need to be Split based off personal ratios | Implement Personalized Expense Splitter |
| :---- | :---- |
| **Pending Payments Tracker** | Implement Payment Tracker |
| **Payment Deadline and Reminder System** | Implement Payment Deadline and Reminder System |
| **Expense Predictor** | Implement Expense Predictor |
| **Enhance UI/ UX of all screens** | Integrate better design for the app |

In Milestone 2, our plan centers on building essential financial features and significantly improving the user experience of the app. We will implement the Personalized Expense Splitter, enabling users to divide expenses based on custom ratios tailored to individual contributions. Alongside this, the Payment Tracker and Payment Deadline & Reminder System will allow users to monitor pending payments and receive timely alerts, ensuring accountability within groups. To enhance planning, we will introduce the Expense Predictor, which offers insights into future spending based on past patterns. Finally, we will focus on refining the UI/UX across all screens, integrating a more polished and intuitive design to create a seamless and visually appealing user journey.

[image1]: <data:image/png;base64,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Rk79GTZsmL+gfayxsTHe1KrwGkIORwUrVqzI1gP5W2eBvA+5LuzJsHv37ha3w+9t69at/uoX+JLZAhcPLInLQWmkUIT069cv2xY/jpychBJ333335e4rTbwPyw0FDkCl9uzZE29yPXv2jDfljBo1yl/vVJZSxubOneseeugh97Wvfe34H8z97jvf+Y5/3Le+9S23fft2d8899/jbl112mV/KJbtKySW4duzY4X7zm9+02C6+8pWv+Ourjhw50t8OryHXUf3000+z66mOHz8+e04QLh92wQUX+NeYOHGiPxIVmzRpUrwpIyVXniuRy34F3/3ud7P10tdvze9///vczyzXiJXf3Xnnnddie0wmX+S1f/WrX7lisehWrlyZ3SfXm5Wjaz//+c/d7NmzW/0dpMxsgevoDJz8xxLWQ3GjwJ3atDXzFhLvw3JDgQPQEdOnT/fLUCTkj30oVqJ///6+yJQWOClobfnTn/7ki1fQt29fv7zuuuv88tvf/rZfXnLJJe7o0aP+towvueiii9zVV1/t73/11Vf98hvf+Ia/bmrv3r19GRRS4ILS1whGjx7tlz/5yU/cLbfc4gYPHuxvy/N+9KMf+XUpWMHll1/uzj77bHfDDTdk2+TnHjNmjF/fuHGj/5niWT75/ZX+myvvZfXq1X699PWFFD2ZKJkxY4Z7/PHH3S9/+cvsPYcSGH4uua65/Mzyc915553u+9//vi9r999/v79frlUrZIZt+fLlvsDJa9fV1fntonQ/4ktmCxwXs+8eifdhuaHAAeiIuMCJf/zjH34pMztbtmzx6+XMwMWkzFx11VVZeYoLnBQT8cMf/tAvw3sIJU2KjvjmN7/py4yQEiUJRefrX/+6X4bXCF5//XW/DLNP5557rp+Nkpmz0hk48bOf/cwvb7zxRr8MwgycFK0wzk033eTeeOON7P7q6urs8fL8P/7xj9l7i19fznuW2bFwqHjIkCH+Z/7FL37hDh486LeF54bJmDBrec0117S4/+GHH/azbMEPfvCDFjNtUkjROrMFLh5YUl9fnysIxG5kf8X7sNxQ4AB0RPj3Qma3hPz7I8VElmL48OH+35bSAheKlUaKzNKlS/05Xtdee62fQWtoaMiKmxxClcO0MrsntAIns2dyjvYVV1zhC5xMUPz617/294Uis2vXLr8Mr3HxxRf75wwcONDf/ulP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nAOXeChwAADoKHDEZChwAADozBa4pqam3OAknVDgAADQWSxwfI0IocABANAGiwVO8CGGxEOBAwBAZ7bAMQOXdihwAADozBa4eGCSVihwAADozBY4ZuDSDgUOAACd2QJXzsXs9+8/6PbVHnANDV/k7iNdF/n9y36Q/RHf19lQ4AAA0JktcPHApfnii2Ou9iSWBXLyIvtF9k+8vaOhwAEAoDNb4LRDqFIO6uuP5LYTO5H9U2mJo8ABAKA74wocM29nRirdTxQ4AAB0ZgtcPDBJKxQ4AAB0FgucvxJDPLDkMIdOz6hUsr8ocAAA6MwWuMbGxtzg1btqctuI3VSyvyhwAADoLBY40eoM3M7P9+S2lWbq1Knutddec/X19S22L1u2LPdYLU8//XRu2x133JHb1lrWr1+f23aq05GfravT3v5qKxQ4AAB03arA9ejRwy+lyMmyrq7OF4FQcuT2ypUr/fqTTz7pl5s3b3afffbZidffuTNX4JYuXeoLnMwILliwwG/bunWrX65du7bF80OBW7RokV+uWbMme051dXW2vmTJkuz1Fy5cmL3me++9l7238FphvXT8hoaG7LHhZ6utrc1e00ra219thQIHAIDOYoHzh1Cbmppyg7dXCKTALV682N11113+9ltvveUGDx6clZxVq1b55YoVK9yUKVN88ZIyFErUjBkz3KOPPpq93n333eeXffr0cf369fPrL7/8srv77rv9+qefftri+VK0wmzd3r17s3V5nblz5/r1J554wi8/+OAD179//2yssWPH+uWsWbP8ewvbw3rv3r39cujQoe6RRx7x65MmTcp+tunTp7uZM2dmz7OQ9vZXW6HAAQCgM1vgWvsakfYKQZiBGzlypF/KLNWuXbuykjN69Gi/lMIlxUjKntwvke1S8Epn4KS4yVKKmJQwedyePXt88Zs2bZq/r/T5UuD69u3r1+fNm+cGDhzo12+77baswE2ePNkvZ8+e7Xr16uWfK2VlwoQJfvurr77aaoG7//77s/cUtkkBLD2EGgqnlbS3v9oKBQ4AAJ3FAicqOoQqRezo0aN+tuv555/PSs7DDz/sC5qUpFCupAQNGzbMrz/wwANuzJgx2ett2rTJz3gNGDDAH0qV9Q0bNvj7woxZ6fOlwMlh2EGDBvnbUuZGjBjhn9NagZMZvDBbWFrgtm3b5p577jl/O6xX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>
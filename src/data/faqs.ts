/**
 * FAQ page content. Replace placeholders with your copy.
 */

export interface FaqPageIntro {
  heading: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqPageIntro: FaqPageIntro = {
  heading: "Frequently Asked Questions",
  description:
    "Frequently asked questions about KBK Community Closet. Search or browse below.",
};

export const faqItems: FaqItem[] = [
  {
    id: "who-can-use",
    question: "Who can use the Kennebunk Community Closet?",
    answer:
      "Any local family in need of children’s clothing is welcome to use the Community Closet. There are no income requirements, and families may request support as needs arise."
  },
  {
    id: "year-round-request",
    question: "How does the year-round clothing request work?",
    answer:
      "Families can submit a request form for children’s clothing throughout the year. Requests are filled based on availability, and we will reach out when items are ready for pickup."
  },
  {
    id: "items-accepted",
    question: "What items do you accept and provide?",
    answer:
      "We primarily offer gently used children’s clothing. When available, we also provide maternity clothing and select baby items. Items are carefully reviewed to ensure they are clean, safe, and in good condition.",
  },
  {
    id: "swap-events",
    question: "How do the pop-up events work?",
    answer:
      "Twice a year, we host community pop-up events where families can bring gently worn children’s clothing to donate and then “shop” for items their children need. Donations are appreciated but not required to participate."
  },
  {
    id: "how-to-support",
    question: "How can I help support the Community Closet?",
    answer:
      "Community members can support us by donating gently used clothing, volunteering their time, or spreading the word about our services and events."
  },
  {
    id: "location",
    question: "Where is the KBK Community Closet located?",
    answer:
      "The KBK Children’s Community Closet is located at Kennebunk Bible Church. The church has graciously allowed us to have a space where we can gather and store the donations that we’ve received until they find a good home."
  },
];

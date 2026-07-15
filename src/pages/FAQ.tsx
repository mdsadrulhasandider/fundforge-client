import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "What is FundForge?",
    answer: "FundForge is a premium crowdfunding platform where supporters purchase platform credits to back projects, products, and causes proposed by vetted creators. Creators can then request fund withdrawals directly in dollars."
  },
  {
    question: "How does the credit system work?",
    answer: "Supporters buy credit packages (e.g. 100 credits for $10). They can contribute these credits toward any approved campaign. When a Creator approves the contribution, the campaign's raised amount increases. If the contribution is rejected, the credits are refunded back to the Supporter."
  },
  {
    question: "What is the withdrawal rate for Creators?",
    answer: "Creators withdraw funds at a rate of 20 credits = $1. The minimum withdrawal threshold is 200 credits, equivalent to $10. Admin approval is required for all withdrawals to ensure security and prevent fraudulent activity."
  },
  {
    question: "What happens if a campaign is deleted?",
    answer: "If a Creator deletes an active campaign, all approved or pending contributions are automatically refunded back to the respective supporters' available credit balance. This guarantees that backers are never left empty-handed."
  },
  {
    question: "How do I upload campaign images?",
    answer: "During campaign registration or addition, you can upload campaign images directly via imgBB. Select 'Upload File' in the form, choose your image, and our system automatically hosts the asset and stores the URL."
  },
  {
    question: "Is there a report system?",
    answer: "Yes. If you find a campaign that is suspicious or fraudulent, you can click 'Report Campaign' on its details page. This sends an alert to the Admin dashboard, where administrators can suspend or delete the campaign."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-3 rounded-full bg-blue-600/10 text-blue-500">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold font-display text-white">Frequently Asked Questions</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Need help? Here are the most common questions regarding platform credits, contributions, and project administration.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-900 bg-slate-950/40 overflow-hidden transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 flex items-center justify-between text-slate-100 hover:text-white font-medium font-display transition cursor-pointer"
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm text-slate-400 border-t border-slate-900/60 pt-4 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;

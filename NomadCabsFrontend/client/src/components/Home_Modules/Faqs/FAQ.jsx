import {useState } from 'react'
import CarImg from '../../../assets/faq/car.png'

const faqItems = [
  {
    question: 'How do I book a cab with Nomad Cabs?',
    answer:
      'Booking is simple! You can book directly through our website. Just enter your pickup and drop-off locations, choose your vehicle type, and confirm your ride.',
  },
  {
    question: 'What types of vehicles are available?',
    answer:
      'We offer a diverse fleet to meet your needs, including sedans for solo or small group travel, SUVs for larger groups and extra luggage, and premium luxury cars for special occasions. We also have eco-friendly options available in select areas.',
  },
  {
    question: 'Are your drivers background-checked and licensed?',
    answer:
      'Absolutely. All Nomad Cabs drivers undergo a rigorous screening process, including comprehensive background checks and regular vehicle inspections. They are also fully licensed and insured, ensuring your safety and peace of mind on every trip.',
  },
  {
    question: 'How do I know the fare for my ride?',
    answer:
      'Our pricing is transparent and upfront. When you book through our website, you will receive an estimated fare before confirming your ride. This fare is calculated based on distance, time, and current demand, with no hidden fees.',
  },
  {
    question: 'Can I schedule a ride in advance?',
    answer:
      'Yes, you can! We offer a pre-booking feature that allows you to schedule a ride for a specific date and time. This is perfect for airport transfers, important appointments, or any time you need to ensure a cab is ready and waiting for you.',
  },
  {
    question: 'What if I need to cancel my booking?',
    answer:
      'You can cancel your booking directly through the app with interactive and clean UI. A cancellation fee may apply if you cancel within a certain time frame of your scheduled pickup, but we offer a grace period for last-minute changes.',
  }
];

const FAQ = () => {
  
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }

 const AccordionItem = ({ item, index, isOpen, onToggle }) => {

    return (
      <div className="border-b last:border-b-0 ">
        <button
          onClick={onToggle}
          className={`w-full text-left p-5 Normal font-semibold transition-colors ${
            isOpen ? 'bg-[#ff4d31] text-white' : 'bg-surface'
          }`}
        >
          {index + 1}. {item.question}
        </button>
        <div
          className={`
            overflow-hidden transition-[max-height] duration-300 ease-in-out
            ${isOpen ? 'max-h-[500px]' : 'max-h-0'} 
          `}
        >
          <div className="bg-surface p-6">
            <p className="Paragraph text-[#8f8e8b]">{item.answer}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="FAQ" className="mb-50 mt-30">
      <div className="cont">
        <div className="text-center flex flex-col items-center justify-center">
          <h4 className="Normal font-semibold">FAQ</h4>
          <h2 className="Heading font-bold">Frequently Asked Questions</h2>
          <p className="Paragraph text-[#8f8e8b] md:w-200 mt-5">
            Frequently Asked Questions About the Car Rental Booking Process on Our Website: Answers to
            Common Concerns and Inquiries.
          </p>
        </div>

        <div className="flex flex-col gap-15 items-center mt-15">
          <div className="hidden md:block">
            <img src={CarImg} alt="FAQ car" className="md:block hidden absolute left-0 z-[-1] w-80" />
          </div>

          <div className="rounded-lg md:w-200 shadowPrim overflow-hidden bg-surface">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
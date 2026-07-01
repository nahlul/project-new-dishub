import React from 'react';
import { faqs } from '../mockData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { MessageCircleQuestion } from 'lucide-react';

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
            <MessageCircleQuestion className="w-8 h-8 text-sky-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="w-24 h-1 bg-sky-600 mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar layanan Trans Koetaradja
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white border-2 rounded-xl px-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-sky-500"
              >
                <AccordionTrigger className="text-left font-semibold text-lg text-gray-900 hover:text-sky-600 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Masih ada pertanyaan?
            </h3>
            <p className="text-gray-600 mb-6">
              Tim kami siap membantu Anda. Hubungi kami melalui kontak yang tersedia di bagian footer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+6265117551234"
                className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Hubungi Kami
              </a>
              <a 
                href="mailto:info@transkutaraja.acehprov.go.id"
                className="inline-flex items-center justify-center border-2 border-sky-600 text-sky-600 hover:bg-sky-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Kirim Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

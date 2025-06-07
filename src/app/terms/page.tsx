import {
  FileText,
  ClipboardList,
  CreditCard,
  Truck,
  AlertCircle,
} from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-indigo-100 p-4 rounded-full mb-6">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600">Last updated: June 2023</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="prose max-w-none">
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <ClipboardList className="w-6 h-6 text-indigo-600 mr-3" />
                  General Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using the Commersely website, you accept and
                  agree to be bound by these Terms of Service. If you do not
                  agree, you may not use our services.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <CreditCard className="w-6 h-6 text-indigo-600 mr-3" />
                  Purchases & Payments
                </h2>
                <p className="text-gray-700 mb-4">
                  All purchases are subject to availability. We reserve the
                  right to limit quantities and to discontinue products at any
                  time without notice.
                </p>
                <p className="text-gray-700">
                  Prices are subject to change without notice. We are not
                  responsible for typographical errors regarding price or
                  product information.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Truck className="w-6 h-6 text-indigo-600 mr-3" />
                  Shipping & Delivery
                </h2>
                <p className="text-gray-700 mb-4">
                  Shipping times are estimates and not guaranteed. We are not
                  responsible for delays caused by carriers or customs.
                </p>
                <p className="text-gray-700">
                  Risk of loss and title for items purchased pass to you upon
                  our delivery to the carrier.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 text-indigo-600 mr-3" />
                  Returns & Refunds
                </h2>
                <p className="text-gray-700 mb-4">
                  We accept returns within 30 days of purchase for most items in
                  original condition. Some items may be final sale.
                </p>
                <p className="text-gray-700">
                  Refunds will be issued to the original payment method.
                  Shipping costs are non-refundable.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">Changes to Terms</h2>
                <p className="text-gray-700">
                  We reserve the right to update or modify these Terms at any
                  time without prior notice. Your continued use of the service
                  constitutes acceptance of the updated Terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

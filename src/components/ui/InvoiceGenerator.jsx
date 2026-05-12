import { useState, useEffect } from "react";
import { Calculator, QrCode, MessageCircle, Download, Eye, Save, Plus, Minus } from "lucide-react";
import Modal from "./Modal";
import Badge from "./Badge";
import { Button } from "./button";
import { Input } from "./input";
import { useCurrency } from '../../context/CurrencyContext';

export default function InvoiceGenerator({ patientId, onClose, onSave }) {
  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    gstInclusive: true,
    items: [{ description: "Consultation Fee", quantity: 1, rate: 500, gstRate: 18 }],
    discount: 0,
    notes: "",
  });
  const { formatAmount } = useCurrency();

  const [showPreview, setShowPreview] = useState(false);
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    discount: 0,
    gstAmount: 0,
    total: 0,
  });

  // Calculate totals whenever form data changes
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const discountAmount = (subtotal * formData.discount) / 100;
    const discountedSubtotal = subtotal - discountAmount;

    const gstAmount = formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.rate;
      const itemDiscount = (itemTotal * formData.discount) / 100;
      const itemNet = itemTotal - itemDiscount;
      return sum + (itemNet * item.gstRate) / 100;
    }, 0);

    const total = formData.gstInclusive ? discountedSubtotal : discountedSubtotal + gstAmount;

    setCalculations({
      subtotal,
      discount: discountAmount,
      gstAmount,
      total,
    });
  }, [formData]);

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0, gstRate: 18 }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleSave = () => {
    const invoiceData = {
      ...formData,
      ...calculations,
      patientId,
      status: "draft",
    };
    onSave?.(invoiceData);
    onClose?.();
  };

  const upiUrl = `upi://pay?pa=merchant@upi&pn=NexaCare&am=${calculations.total}&cu=INR&tn=Invoice%20${formData.invoiceNumber}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generate Invoice</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-sm hover:bg-surface-alt"
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)]"
          >
            <Save size={14} /> Save Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invoice Number</label>
              <Input
                value={formData.invoiceNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }))
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GST Inclusive</label>
              <select
                value={formData.gstInclusive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, gstInclusive: e.target.value === "true" }))
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value={true}>GST Inclusive</option>
                <option value={false}>GST Exclusive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invoice Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">Items</label>
              <button
                onClick={addItem}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--brand)] text-white rounded text-xs hover:bg-[var(--brand-hover)]"
              >
                <Plus size={12} /> Add Item
              </button>
            </div>

            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                    className="w-16"
                  />
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    placeholder="GST %"
                    value={item.gstRate}
                    onChange={(e) => updateItem(index, "gstRate", parseFloat(e.target.value) || 0)}
                    className="w-16"
                  />
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded"
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount (%)</label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))
                }
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full h-20 px-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none resize-none focus:border-[var(--brand)]"
              placeholder="Additional notes..."
            />
          </div>
        </div>

        {/* Calculations & Actions */}
        <div className="space-y-4">
          <div className="bg-surface rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Calculator size={16} />
              Invoice Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatAmount(calculations.subtotal)}</span>
              </div>
              {calculations.discount > 0 && (
                <div className="flex justify-between text-[var(--warning)]">
                  <span>Discount:</span>
                  <span>-{formatAmount(calculations.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Amount:</span>
                <span>{formatAmount(calculations.gstAmount)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total:</span>
                <span>{formatAmount(calculations.total)}</span>
              </div>
            </div>
          </div>

          {/* UPI QR Code */}
          <div className="bg-surface rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <QrCode size={16} />
              UPI Payment
            </h3>
            <div className="text-center">
              <div className="w-32 h-32 bg-white border-2 border-border rounded-lg mx-auto mb-3 flex items-center justify-center">
                <QrCode size={48} className="text-[var(--brand)]" />
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Scan to pay {formatAmount(calculations.total)}
              </p>
              <button className="text-xs text-[var(--brand)] hover:underline">Copy UPI ID</button>
            </div>
          </div>

          {/* WhatsApp Preview */}
          <div className="bg-surface rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MessageCircle size={16} />
              WhatsApp Send Preview
            </h3>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="text-xs text-green-700 dark:text-green-300 mb-2">
                📄 *Invoice {formData.invoiceNumber}*
              </div>
              <div className="text-xs text-green-700 dark:text-green-300 mb-2">
                Total: {formatAmount(calculations.total)}
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">
                Pay via UPI: merchant@upi
              </div>
            </div>
            <button className="w-full mt-3 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              Send via WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title="Invoice Preview"
        width="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="border rounded-lg p-6 bg-white">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">NexaCare</h1>
              <p className="text-sm text-muted-foreground">Healthcare Invoice</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Invoice Details</h3>
                <p className="text-sm">Invoice #: {formData.invoiceNumber}</p>
                <p className="text-sm">Date: {formData.date}</p>
                <p className="text-sm">Due Date: {formData.dueDate}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Patient Details</h3>
                <p className="text-sm">Patient ID: {patientId}</p>
              </div>
            </div>

            <table className="w-full mb-6">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-right py-2">GST</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">{formatAmount(item.rate)}</td>
                    <td className="text-right py-2">{item.gstRate}%</td>
                    <td className="text-right py-2">{formatAmount(item.quantity * item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right">
              <p className="text-sm">Subtotal: {formatAmount(calculations.subtotal)}</p>
              {calculations.discount > 0 && (
                <p className="text-sm text-[var(--warning)]">
                  Discount: -{formatAmount(calculations.discount)}
                </p>
              )}
              <p className="text-sm">GST: {formatAmount(calculations.gstAmount)}</p>
              <p className="font-bold text-lg">Total: {formatAmount(calculations.total)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg text-sm hover:bg-surface-alt"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                /* Download PDF */
              }}
              className="flex-1 px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)]"
            >
              <Download size={14} className="inline mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

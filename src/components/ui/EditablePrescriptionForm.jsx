import { useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Minus, Plus } from "lucide-react";
import { Input } from "./input";
import { Textarea } from "./textarea";

const defaultPrescription = {
  medicines: [
    { drug: "Paracetamol 500mg", dose: "1 tablet", frequency: "3 times daily", duration: "5 days" },
  ],
  notes: "Take medicines exactly as prescribed. Review patient response in follow-up.",
};

export default function EditablePrescriptionForm({ value, onChange, patientId }) {
  const form = useForm({
    defaultValues: value || defaultPrescription,
  });

  const { control, register, reset, watch } = form;
  const { fields, append, remove } = useFieldArray({
    name: "medicines",
    control,
  });
  const previousPatientIdRef = useRef(patientId);
  const formValues = watch();

  // Only reset when patient changes, not on every value change
  useEffect(() => {
    if (patientId !== previousPatientIdRef.current) {
      reset(value || defaultPrescription);
      previousPatientIdRef.current = patientId;
    }
  }, [patientId, value, reset]);

  useEffect(() => {
    onChange?.(formValues);
  }, [formValues, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid gap-3 rounded-3xl border border-border bg-surface p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">Medicine {index + 1}</div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-surface-alt"
              >
                <Minus size={14} /> Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                {...register(`medicines.${index}.drug`)}
                placeholder="Drug name"
                className="w-full"
              />
              <Input
                {...register(`medicines.${index}.dose`)}
                placeholder="Dose"
                className="w-full"
              />
              <Input
                {...register(`medicines.${index}.frequency`)}
                placeholder="Frequency"
                className="w-full"
              />
              <Input
                {...register(`medicines.${index}.duration`)}
                placeholder="Duration"
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ drug: "", dose: "", frequency: "", duration: "" })}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm font-medium hover:bg-[var(--brand-hover)] transition-colors"
      >
        <Plus size={14} /> Add medicine
      </button>
      <div className="rounded-3xl border border-border bg-surface p-4">
        <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">
          Patient Instructions
        </div>
        <Textarea
          {...register("notes")}
          placeholder="Add patient-specific instructions or reminders here"
        />
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [
      { title: "NexaCare Care+ — AI Clinic Operating System" },
      {
        name: "description",
        content:
          "AI-powered clinic operating system for Indian private clinics — patients, appointments, pharmacy, revenue, telehealth in one place.",
      },
    ],
  }),
});

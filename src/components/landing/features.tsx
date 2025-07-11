"use client"

import {
  IconBrain,
  IconFileUpload,
  IconMessageChatbot,
  IconRobot,
} from "@tabler/icons-react"

const features = [
  {
    name: "Knowledge Base Upload",
    description:
      "Upload PDFs, documents, and websites. We'll process and embed them for your GPT.",
    icon: IconFileUpload,
  },
  {
    name: "Transcript Processing",
    description:
      "Convert audio and video transcripts into training data for more natural GPT responses.",
    icon: IconMessageChatbot,
  },
  {
    name: "Custom Prompts",
    description:
      "Fine-tune your GPT's behavior with custom instructions and conversation starters.",
    icon: IconBrain,
  },
  {
    name: "One-Click Deploy",
    description:
      "Deploy your custom GPT directly to ChatGPT with a single click. No coding required.",
    icon: IconRobot,
  },
]

export function Features() {
  return (
    <div id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Deploy faster
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to create custom GPTs
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform streamlines the GPT creation process, from data upload to deployment.
            Focus on your content, we'll handle the technical details.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <feature.icon
                    className="size-5 flex-none text-primary"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

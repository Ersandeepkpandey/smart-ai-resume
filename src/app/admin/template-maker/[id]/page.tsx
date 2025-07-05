"use client"

import { use } from "react"
import TemplateMaker from "../page"

interface EditTemplateProps {
  params: Promise<{ id: string }>
}

export default function EditTemplate({ params }: EditTemplateProps) {
  const { id } = use(params)
  return <TemplateMaker params={{ id }} />
}
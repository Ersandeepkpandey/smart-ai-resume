import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportToPDF(element: HTMLElement, filename: string = 'resume.pdf') {
  try {
    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement

    // Set background to white for PDF
    clone.style.backgroundColor = 'white'
    clone.style.padding = '20px'
    clone.style.margin = '0'

    // Temporarily append to body for rendering
    document.body.appendChild(clone)
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    clone.style.top = '0'

    // Convert to canvas
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: clone.scrollWidth,
      height: clone.scrollHeight,
    })

    // Remove the clone
    document.body.removeChild(clone)

    // Calculate PDF dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    let position = 0

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(filename)

    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

export function downloadResumeAsPDF(element: HTMLElement, name: string) {
  const filename = `${name.replace(/\s+/g, '_')}_resume.pdf`
  return exportToPDF(element, filename)
}
declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface jsPDFWithPlugin extends jsPDF {
    autoTable: (options: any) => void;
  }
  
  const autoTable: (doc: jsPDF, options: any) => void;
  export default autoTable;
}

declare module 'html2canvas';

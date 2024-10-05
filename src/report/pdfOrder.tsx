import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { IOrderService } from "../../types/order";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import logo from "../../public/logo.jpeg"; // Importação do logo

interface PdfProps {
  order: IOrderService;
}

export default function PdfOrder({ order }: PdfProps) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  // Função para converter a imagem para Base64
  const getBase64ImageFromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generatePdf = async () => {
    const base64Logo = await getBase64ImageFromUrl(logo.src); // Converter a imagem para Base64

    const docDefinition: TDocumentDefinitions = {
      pageSize: "A4",
      pageMargins: [30, 200, 15, 40],
      header: {
        margin: [50, 20, 0, 0],
        columns: [
          {
            image: base64Logo,
            width: 150,
            alignment: "center",
            margin: [0, 20, 15, 0],
          },
          {
            stack: [
              {
                text: "Manutenção Preventiva, Corretiva em equipamento de informática.",
              },
              { text: "CNPJ: 08.546.821/0001-30 INSC. Municipal: 377.346-9" },
              { text: "Rua Tupiniquins 447 Santo Amaro CEP: 50100-240" },
              { text: "Fone: (81) - 9972-6829 Recife PE." },
              { text: "Nosso Site: www.werknet.com.br" },
            ],
            margin: [0, 40, 0, 0],
          },
        ],
      },
      content: [{ text: order?.defeito, style: "content" }],
      styles: {
        headerData: {
          fontSize: 10,
          margin: [0, 20, 0, 0], // Ajuste de margem para melhor posicionamento
        },
        content: {
          fontSize: 12,
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  };

  // Chamar a função para gerar o PDF
  generatePdf();

  return null; // O componente não precisa renderizar nada
}

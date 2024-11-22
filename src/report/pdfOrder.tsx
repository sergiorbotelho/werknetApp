import dayjs from "dayjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import logo from "../../public/logo.jpeg";
import { IOrderService } from "../types/order";
interface PdfProps {
  order: IOrderService;
}

export default function PdfOrder({ order }: PdfProps) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
    const base64Logo = await getBase64ImageFromUrl(logo.src);

    const docDefinition: TDocumentDefinitions = {
      pageSize: "A4",
      pageMargins: [30, 200, 15, 70],
      header: {
        margin: [20, 20, 0, 0],
        stack: [
          {
            columns: [
              {
                image: base64Logo,
                width: 150,
                alignment: "center",
                margin: [120, 20, 0, 0],
              },
              {
                stack: [
                  {
                    text: "Manutenção Preventiva, Corretiva em equipamento de informática.",
                    style: { fontSize: 10 },
                  },
                  {
                    text: "CNPJ: 08.546.821/0001-30 INSC. Municipal: 377.346-9",
                    style: { fontSize: 10 },
                  },
                  {
                    text: "Rua Tupiniquins 447 Santo Amaro CEP: 50100-240",
                    style: { fontSize: 10 },
                  },
                  {
                    text: "Fone: (81) - 9972-6829 Recife PE.",
                    style: { fontSize: 10 },
                  },
                  {
                    text: "Nosso Site: www.werknet.com.br",
                    style: { fontSize: 10 },
                  },
                ],
                margin: [30, 40, 0, 0],
              },
            ],
          },
          {
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: "OS - ORDEM DE SERVIÇO EXTERNA",
                    alignment: "center",
                    fontSize: 12,
                  },
                  {
                    text: `N.º ${order.id}`,
                    alignment: "center",
                    fontSize: 12,
                  },
                ],
              ],
            },
            margin: [0, 10, 20, 0],
          },
        ],
      },
      content: {
        stack: [
          {
            margin: [0, 0, 0, 3],
            columns: [
              {
                text: `DATA: ${dayjs(order.created_at).format("DD/MM/YYYY")}`,
                style: { fontSize: 12 },
                alignment: "left",
                width: "*",
              },
              {
                text: `CONTATO: ${order.contato.toUpperCase()}`,
                style: { fontSize: 12 },
                alignment: "right",
                marginRight: 15,
              },
            ],
          },
          {
            margin: [0, 0, 0, 3],
            columns: [
              {
                text: `HORA DE CHEGADA: 08:20`,
                style: { fontSize: 12 },
                alignment: "left",
                width: "*",
              },
              {
                text: `HORA DE SAÍDA: 11:55`,
                style: { fontSize: 12 },
                alignment: "right",
                marginRight: 30,
              },
              {
                text: ``,
              },
            ],
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: ["*", "*"],

              body: [
                [
                  {
                    text: `CLIENTE: ${order.client.nome.toUpperCase()}`,
                    alignment: "left",
                  },
                  {
                    text: `FONE: ${order.client.telefone}`,
                    alignment: "right",
                    fontSize: 12,
                    marginRight: 15,
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: [200, 200],
              body: [
                [
                  {
                    text: `ENDEREÇO: ${order.client.endereco.toUpperCase()}`,
                    alignment: "left",
                  },
                  // {
                  //   text: `NÚMERO: ${order.client.numero}`,
                  //   alignment: "left",
                  //   fontSize: 12,
                  // },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: ["*", "*", "*", "*"],
              body: [
                [
                  {
                    text: `NÚMERO: ${order.client.numero}`,
                    alignment: "left",
                    fontSize: 12,
                  },
                  {
                    text: `BAIRRO: ${order.client.bairro.toUpperCase()}`,
                    alignment: "left",
                  },
                  {
                    text: `CIDADE: ${order.client.cidade}`,
                    fontSize: 12,
                    alignment: "center",
                  },
                  {
                    text: `UF: ${order.client.uf}`,
                    fontSize: 12,
                    alignment: "right",
                    marginRight: 15,
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: [200, 200],
              body: [
                [
                  {
                    text: `CPF: ${order.client.cpf}`,
                    alignment: "left",
                  },
                  {
                    text: `CNPJ: ${order.client.cnpj ?? ""}`,
                    alignment: "left",
                    fontSize: 12,
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: `MODELO DO EQUIPAMENTO: ${order.modeloEquipamento}`,
                    alignment: "left",
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: `DEFEITO: ${order.defeito}`,
                    alignment: "left",
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: `DEFEITO CONSTATADO: ${order.defeitoConstatado}`,
                    alignment: "left",
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: `SOLUÇÃO: ${order.solucao}`,
                    alignment: "left",
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: ["*", "*", "*"],
              body: [
                [
                  {
                    text: `VALOR SERVIÇO: ${new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(order.valServico))}`,
                    alignment: "left",
                  },
                  {
                    text: `VALOR MATERIAL: ${new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(order.valMaterial))}`,
                    alignment: "center",
                  },
                  {
                    text: `TOTAL: ${new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(order.total))}`,
                    alignment: "right",
                    marginRight: 15,
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            margin: [0, 0, 0, 2],
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: `GARANTIA DE PEÇA: ${order.garantiaPeca.toUpperCase()}`,
                    alignment: "left",
                  },
                  {
                    text: `GARANTIA DE SERVIÇO: ${order.garantiaServico.toUpperCase()}`,
                    alignment: "right",
                    marginRight: 15,
                  },
                ],
              ],
            },
          },
          {
            layout: {
              defaultBorder: true,
              hLineWidth: (i, node) =>
                i === 0 || i === node.table.body.length ? 1 : 0, // Bordas horizontais externas
              vLineWidth: (i, node) =>
                i === 0 || i === node.table.widths.length ? 1 : 0, // Bordas verticais externas
              hLineColor: () => "black",
              vLineColor: () => "black",
              paddingLeft: () => 5,
              paddingRight: () => 5,
              paddingTop: () => 5,
              paddingBottom: () => 5,
            },
            margin: [0, 30, 15, 30],
            table: {
              widths: ["*"], // Coluna única
              body: [
                [
                  {
                    text: "01 - O prazo de cobertura da garantia de serviço será contado a partir da data de saída, somente terá validade mediante a apresentação deste documento.",
                    margin: [5, 0, 5, 0],
                    fontSize: 10,
                    alignment: "left",
                  },
                ],
                [
                  {
                    text: "02 - Não nos responsabilizamos por falha causada por agentes da natureza, por mau uso dos componentes por usuário não classificados, e programas ou arquivos de dados que estejam dentro do computador.",
                    margin: [5, 0, 5, 0],
                    fontSize: 10,
                    alignment: "left",
                  },
                ],
                [
                  {
                    text: "03 - Esta garantia será considerada nula de pleno direito, na hipótese de abertura de um dos equipamentos, quer para conserto, por técnico não autorizado.",
                    margin: [5, 0, 5, 0],
                    fontSize: 10,
                  },
                ],
                [
                  {
                    text: "04 - Restringimos nossa responsabilidade à substituição de peças defeituosas, desde que a critério de nosso Dep.Técnico, se constatar falhas em condições normais de uso. Neste caso o prazo para a substituição será de 08 (oito) dias úteis a contar da data de recepção em nossa Empresa.",
                    margin: [5, 0, 5, 0],
                    fontSize: 10,
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",
            // marginTop: 100,
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "Obs.: O cliente terá prazo de 90 dias para a retirada do(s) equipamento(s), na aprovação ou não do orçamento pelo cliente, e passado do prazo o equipamento será vendido para pagar despesas e serviços da empresa. ",
                    margin: [0, 15, 0, 15],
                    fontSize: 12,
                  },
                ],
              ],
            },
          },
        ],
      },
      footer: {
        margin: [15, 0, 15, 80],
        stack: [
          {
            layout: "noBorders",

            table: {
              widths: ["*", "*", "*"],
              body: [
                [
                  {
                    text: `____________________________`,
                    alignment: "center",
                  },
                  {
                    text: `____________________________`,
                    alignment: "center",
                  },
                  {
                    text: `____________________________`,
                    alignment: "center",
                  },
                ],
              ],
            },
          },
          {
            layout: "noBorders",

            table: {
              widths: ["*", "*", "*"],
              body: [
                [
                  {
                    text: `Técnico`,
                    alignment: "center",
                  },
                  {
                    text: `Recepção`,
                    alignment: "center",
                  },
                  {
                    text: `Cliente`,
                    alignment: "center",
                  },
                ],
              ],
            },
          },
        ],
      },

      styles: {
        content: {
          fontSize: 12,
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  };

  generatePdf();

  return null;
}

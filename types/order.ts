export interface IOrderService {
  id: number;
  defeito: string;
  defeitoConstatado: string;
  garantiaPeca: string;
  garantiaServico: string;
  modeloEquipamento: string;
  solucao: string;
  tipoServico: string;
  total: string;
  valMaterial: string;
  valServico: string;
  client: {
    id: number;
    nome: string;
    telefone: string;
    cpf: string;
    cnpj: string;
    cep: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
  };
}

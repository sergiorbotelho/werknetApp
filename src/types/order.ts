export interface IOrderService {
  id: number;
  contato: string;
  horaChegada: string;
  horaSaida: string;
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
  created_at: string;
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

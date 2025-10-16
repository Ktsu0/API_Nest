export interface Serie {
  // O ID é um identificador único, como na sua lista
  id: string; 
  
  // O título da série
  titulo: string;
  
  // Breve descrição (ex: 5 temporadas | Crime/Drama)
  descricao: {
    temporada: string,
    tema: string
    }
  
  // Detalhes estendidos sobre a trama
  detalhes: string;
  
  // URL da imagem ou GIF
  imagem: string;

  avaliacao?: number; // Novo componente

}
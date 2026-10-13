import type { Area } from "react-easy-crop";

const AVATAR_SIZE = 512;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Falha ao carregar a imagem"));
    image.src = src;
  });
}

// Desenha a área recortada (em pixels da imagem original) num quadrado de
// 512×512 e devolve um JPEG. A API aceita até 1 MB; com 512×512 fica bem abaixo.
export async function cropToAvatar(src: string, area: Area): Promise<Blob> {
  const image = await loadImage(src);

  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas indisponível");
  }

  // JPEG não tem transparência: sem fundo, o transparente de um PNG vira preto
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem")),
      "image/jpeg",
      0.9,
    );
  });
}


export interface ProductImage {
  base64: string;
  mimeType: string;
}

export interface ModelConfig {
  gender: string;
  age: string;
  ethnicity: string;
  setting: string;
  details: string;
}

export interface GeneratedImageData {
  imageUrl: string;
  description: string;
}

export enum CodeFormat {
  EAN = 'EAN_13',
  QR = 'QR_CODE'
}

export interface CodeResult {
  text: string;
  format: CodeFormat;
}

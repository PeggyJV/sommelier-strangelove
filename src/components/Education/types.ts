export enum EduCardVariant {
  Left = "LEFT",
  Top = "TOP",
  Bottom = "BOTTOM",
}

export interface EduItem {
  title: string
  url: string
  variant: EduCardVariant
}

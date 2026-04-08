export interface ValidateRequest {
  criteriaType: "PHONE" | "USERNAME";
  criteriaValue: string;
}

export interface ValidateResponse {
  validationMessage: string;
  valid: boolean;
}

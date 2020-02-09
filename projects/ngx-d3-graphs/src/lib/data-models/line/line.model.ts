export interface LineModel {
  show?: boolean;
  step?: {
    type?: 'step' | 'step-before' | 'step-after';
  };
}

export type FeatureModalProps = {
  visible: boolean;
  onClose: () => void;
  feature: any | null;
  seaLevel: number;
  delta: number;
};
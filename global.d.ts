interface Window {
  isApp?: boolean;
  kakaoAdFit?: {
    display: (container: HTMLElement) => void;
    refresh: () => void;
  };
}
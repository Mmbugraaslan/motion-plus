// Scene split: hook 20%, offer 27%, points 30%, CTA 23%
export const sceneFrames = (total: number) => {
  const hook = Math.round(total * 0.2);
  const offer = Math.round(total * 0.27);
  const points = Math.round(total * 0.3);
  const cta = total - hook - offer - points;
  return { hook, offer, points, cta };
};

import { theme } from "@exploriana/config";
import { IconProps } from "@exploriana/interface";
import Svg, { Ellipse, Path } from "react-native-svg";

export function Bus({ fill = theme.colors.text, height = 64, width = 64 }: IconProps) {
  return (
    <Svg width={width} height={height} preserveAspectRatio="xMidYMid meet" viewBox="0 0 64 64">
      <Path fill={fill} d="M11.974 49.959h5.931v2.98h-5.931zm34 0h5.932v2.98h-5.932z" />
      <Ellipse cx="50.685" cy="43.46" fill={fill} rx="2.403" ry="2.416" />
      <Ellipse cx="45.49" cy="43.46" fill={fill} rx="2.402" ry="2.416" />
      <Ellipse cx="18.511" cy="43.46" fill={fill} rx="2.403" ry="2.416" />
      <Ellipse cx="13.316" cy="43.46" fill={fill} rx="2.403" ry="2.416" />
      <Path
        fill={fill}
        d="M60.001 15.754h-.382L56 12.116V7.711a3.01 3.01 0 0 0-3-3.018h-5.05C47.95 3.205 47.156 2 46.178 2H17.824c-.98 0-1.772 1.205-1.772 2.693H11a3.01 3.01 0 0 0-3 3.018v4.405l-3.618 3.638h-.381c-.553 0-1.001.449-1.001 1.005v8.042c0 .557.448 1.006 1.001 1.006H6c.554 0 1-.449 1-1.006v-8.042a1 1 0 0 0-1-1.005h-.203L8 13.538v40.419a3.008 3.008 0 0 0 3 3.016v3.018c0 1.105.901 2.01 2.001 2.01h4A2.01 2.01 0 0 0 19 59.991v-3.018h26v3.018c0 1.105.901 2.01 2.001 2.01h4A2.01 2.01 0 0 0 53 59.991v-3.018c1.657 0 3-1.35 3-3.016V13.538l2.205 2.216H58c-.552 0-1 .449-1 1.005v8.042c0 .557.448 1.006 1 1.006h2.001A1 1 0 0 0 61 24.801v-8.042a1 1 0 0 0-.999-1.005M41.092 45.408v1.006H22.91v-1.006h18.182M22.91 44.404v-1.006h18.182v1.006H22.91m18.182 3.016v1.006H22.91V47.42h18.182m0 2.01v1.006H22.91V49.43h18.182m0 2.011v1.004H22.91v-1.004h18.182m12.357 2.989h-8.896v-5.961h8.896v5.961m-34 0h-8.896v-5.961h8.896v5.961M42 46.926v-4.533H22v4.533H10V7.711a1.01 1.01 0 0 1 1-1.017h42c.552 0 1 .456 1 1.017v39.215H42"
      />
      <Path
        fill={fill}
        d="M17.824 15.285h28.354c.979 0 1.772-.797 1.772-1.782V9.94c0-.985-.794-1.782-1.772-1.782H17.824c-.98 0-1.772.797-1.772 1.782v3.563c0 .985.792 1.782 1.772 1.782m6.946-3.764l-.266.267l-.264-.267V9.987h.529v1.534zm1.126 2.268a.425.425 0 0 1-.33.334l-.198-.534v-1.4l.397-.4l.131.134v1.866m2.788.334h-1.458l-.266-.268l.266-.267h1.458l.266.267l-.266.268m.664-.667l-.332.333l-.199-.2v-1.4l.398-.4l.133.134v1.533m7.429.667h-1.459l-.266-.268l.266-.267h1.459l.266.267l-.266.268m.662-.667l-.33.333l-.199-.2v-1.4l.398-.4l.131.134v1.533m4.453-4.136h2.183l-.199.534h-1.784l-.53-.2a.425.425 0 0 1 .33-.334m2.182 2.402l-.265.267h-1.726l-.266-.267l.266-.267h1.726l.265.267m-2.52-1.935l.53.2v1.268l-.397.4l-.133-.134V9.787m0 2.135l.133-.134l.397.4v1.268l-.53.2v-1.734m.53 1.667h1.791l.199.534h-2.189a.426.426 0 0 1-.331-.334l.53-.2m-1.725-3.668l.199-.533a.424.424 0 0 1 .332.333v1.867l-.133.134l-.398-.4V9.921m0 2.267l.398-.4l.133.134v1.867a.427.427 0 0 1-.332.334l-.199-.534v-1.401m-1.591-2.267h.398l1.061 1.066v.334h-.464l-.995-1v-.4m-.664-.2a.427.427 0 0 1 .332-.333l.199.533v1.4l-.398.4l-.133-.134V9.721m0 2.201l.133-.134l.398.4v1.4l-.199.534a.43.43 0 0 1-.332-.334v-1.866m-.665-1.935v1.534l-.131.134l-.398-.4v-1.4l.199-.2l.33.332m-2.121-.667h1.459l.266.268l-.266.267h-1.459l-.266-.267l.266-.268m-.663.667l.331-.333l.199.2v1.4l-.398.4l-.132-.134V9.987m0 1.935l.132-.134l.398.4v1.4l-.199.2l-.331-.333v-1.533m-1.194-2.068l.198-.534a.428.428 0 0 1 .332.334v1.867l-.133.134l-.397-.4V9.854m0 2.268l.397-.4l.133.134v1.866a.426.426 0 0 1-.332.334l-.198-.533v-1.401m-1.194-2.268l.198-.534a.428.428 0 0 1 .332.334v1.867l-.133.134l-.397-.4V9.854m0 2.334l.397-.4l.133.134v1.867a.428.428 0 0 1-.332.334l-.198-.534v-1.401m-2.256-.266l.133-.134l.397.4v1.268l-.53.2v-1.734m.53 1.667h1.593l.198.534h-1.989a.426.426 0 0 1-.332-.334l.53-.2m-1.193-3.602v1.534l-.133.134l-.398-.4v-1.4l.199-.2l.332.332m-2.122-.667h1.458l.266.268l-.266.267h-1.458l-.266-.267l.266-.268m-.665.667l.332-.333l.199.2v1.4l-.398.4l-.133-.134V9.987m0 1.935l.133-.134l.398.4v1.4l-.199.2l-.332-.333v-1.533m-.665-2.268v1.867l-.131.134l-.397-.4v-1.4l.198-.534a.422.422 0 0 1 .33.333m-2.447-.334h1.984l-.199.534h-1.585l-.53-.2a.427.427 0 0 1 .33-.334m-.337.467l.53.2v1.268l-.398.4l-.132-.134V9.787m0 2.135l.132-.134l.398.4v1.4l-.199.534a.426.426 0 0 1-.331-.334v-1.866M20.266 9.32h2.183l-.2.534h-1.783l-.53-.2a.426.426 0 0 1 .33-.334m2.182 2.402l-.265.267h-1.726l-.266-.267l.266-.267h1.726l.265.267m-2.52-1.935l.53.2v1.268l-.397.4l-.133-.134V9.787m0 2.135l.133-.134l.397.4v1.268l-.53.2v-1.734m.53 1.667h1.79l.2.534h-2.19a.427.427 0 0 1-.33-.334l.53-.2m21.817 22.682h-8.957v-1.006H51.5v1.006h-8.113l4.4 2.358h2.438a2.785 2.785 0 0 0 2.776-2.793V19.423a2.784 2.784 0 0 0-2.776-2.791H13.777a2.783 2.783 0 0 0-2.776 2.791v16.414a2.784 2.784 0 0 0 2.776 2.793h12.244l-4.527-2.358h-8.957v-1.006h18.182v1.006h-8.113l4.4 2.358h19.797l-4.528-2.359"
      />
    </Svg>
  );
}
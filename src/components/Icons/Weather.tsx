import { theme } from "@exploriana/config/theme";
import { IconProps } from "@exploriana/interface";
import React from "react";
import { Path, Svg } from "react-native-svg";

export function Weather({ fill = theme.colors.text, height = 64, width = 64 }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64">
      <Path
        fill={fill}
        d="M23.367 10.211L20.002 2l-3.368 8.211A19.543 19.543 0 0120 9.902c1.152 0 2.273.118 3.367.309M9.903 19.999c0-1.15.116-2.271.309-3.365L2 20.001l8.211 3.365a19.429 19.429 0 01-.308-3.367m2.958-7.14a19.395 19.395 0 012.598-2.162L7.272 7.272l3.427 8.186a19.228 19.228 0 012.162-2.599"
      ></Path>
      <Path
        fill={fill}
        d="M56.511 14.725a10.772 10.772 0 00-.496-.267v-.078C56.015 7.555 50.43 2 43.566 2c-4.27 0-8.23 2.183-10.508 5.742-.088-.014-.177-.026-.266-.041a12.317 12.317 0 00-1.758-.134c-3.623 0-6.977 1.614-9.266 4.224A8.4 8.4 0 0011.599 20a8.355 8.355 0 002.929 6.352c.075.953.298 1.871.642 2.733a19.336 19.336 0 01-2.313-1.944 19.458 19.458 0 01-2.16-2.6l-3.426 8.187 8.019-3.355a9.423 9.423 0 002.585 3.445L20.002 38l1.367-3.335a9.46 9.46 0 002.627.379h27.055c.817 0 1.646-.095 2.466-.285C58.51 33.619 62 29.258 62 24.154c0-3.875-2.104-7.488-5.489-9.429M52.8 31.692a7.634 7.634 0 01-1.747.205H23.996a6.263 6.263 0 01-1.984-.322c-2.521-.827-4.344-3.188-4.344-5.973 0-1.894.843-3.587 2.171-4.739a6.305 6.305 0 012.073-1.2 6.36 6.36 0 012.084-.357c2.041 0 3.851.966 5.01 2.457l.057-.001a8.678 8.678 0 00-6.797-4.473 9.127 9.127 0 018.77-6.576c.445 0 .879.043 1.305.104a9.157 9.157 0 012.407.686 9.092 9.092 0 015.314 6.984l.002-.054c0-3.563-1.837-6.696-4.618-8.524a9.287 9.287 0 018.121-4.762c5.126 0 9.281 4.134 9.281 9.232 0 .248-.017.489-.035.732a9.72 9.72 0 00-5.629 2.336 7.776 7.776 0 015.392-.881c.842.167 1.633.47 2.352.884 2.333 1.338 3.906 3.835 3.906 6.703 0 3.676-2.578 6.751-6.034 7.539M33.008 47.575c.674-1.85.719-4.382.262-7.316-2.201 1.924-3.832 3.922-4.504 5.771-.572 1.569-.086 3.189 1.086 3.616s2.586-.501 3.156-2.071m8.855 0c.672-1.85.719-4.382.262-7.316-2.203 1.924-3.832 3.922-4.506 5.771-.57 1.569-.086 3.189 1.086 3.616s2.586-.501 3.158-2.071m4.611-1.545c-.571 1.569-.086 3.189 1.086 3.616s2.586-.502 3.157-2.071c.673-1.85.719-4.382.262-7.316-2.203 1.924-3.833 3.922-4.505 5.771m-22.32 1.545c.673-1.85.719-4.382.262-7.316-2.202 1.924-3.832 3.922-4.505 5.771-.571 1.569-.086 3.189 1.086 3.616s2.586-.501 3.157-2.071M21.815 58.28c-.571 1.569-.086 3.189 1.086 3.616s2.586-.502 3.157-2.071c.673-1.85.719-4.382.262-7.316-2.202 1.924-3.832 3.922-4.505 5.771m8.855 0c-.571 1.569-.086 3.189 1.086 3.616s2.586-.502 3.157-2.071c.673-1.85.719-4.382.262-7.316-2.202 1.924-3.832 3.922-4.505 5.771m8.853 0c-.57 1.569-.086 3.189 1.086 3.616s2.586-.502 3.158-2.071c.672-1.85.719-4.382.262-7.316-2.203 1.924-3.832 3.922-4.506 5.771m-26.563 0c-.57 1.569-.086 3.189 1.086 3.616s2.586-.502 3.159-2.071c.672-1.85.719-4.382.262-7.316-2.204 1.924-3.833 3.922-4.507 5.771"
      ></Path>
    </Svg>
  );
}

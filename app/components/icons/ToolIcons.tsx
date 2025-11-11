import type { ComponentType, ReactElement } from "react";
import type { IconProps } from "./types";

import ConventionSvg from "@/public/assets/icons/convention.svg";
import DossierSvg from "@/public/assets/icons/dossier.svg";
import OfferSvg from "@/public/assets/icons/offer.svg";
import TeamsSvg from "@/public/assets/icons/teams.svg";
import LogoSvg from "@/public/assets/logo.svg";

type SvgComponent = ComponentType<IconProps>;

type IconFactory = (props: IconProps) => ReactElement;

function createIcon(Svg: SvgComponent): IconFactory {
  return function IconComponent(props: IconProps): ReactElement {
    const { ["aria-hidden"]: ariaHidden, focusable, ...rest } = props;

    return (
      <Svg
        {...rest}
        aria-hidden={ariaHidden ?? "true"}
        focusable={focusable ?? "false"}
      />
    );
  };
}

export const OfferIcon = createIcon(OfferSvg);
export const ConventionIcon = createIcon(ConventionSvg);
export const DevoirIcon = createIcon(TeamsSvg);
export const DossierIcon = createIcon(DossierSvg);
export const LogoMark = createIcon(LogoSvg);

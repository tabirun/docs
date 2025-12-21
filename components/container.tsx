import { ComponentChildren } from "@tabirun/pages/preact";

interface ContainerProps {
  children: ComponentChildren;
}

export const Container = (props: ContainerProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      {props.children}
    </div>
  );
};

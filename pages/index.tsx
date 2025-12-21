import { Frontmatter } from "@tabirun/pages/preact";
import { Container } from "../components/container.tsx";
import { Button } from "../components/button.tsx";

export const frontmatter: Frontmatter = {
  title: "Tabi | Home",
};

export default function HomePage() {
  return (
    <Container>
      <div>Welcome to the Tabi Documentation!</div>
      <div>
        <Button as="a" href="/docs/getting-started" theme="brand">
          Get Started
        </Button>
      </div>
    </Container>
  );
}

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "../../test-utils";
import Settings from "./Settings";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock des hooks d'authentification si nécessaire
vi.mock("react-auth-kit/hooks/useAuthHeader", () => ({
  default: () => "Bearer mock-token",
}));

describe("Settings", () => {
  beforeEach(() => {
    render(<Settings />);
  });

  it("devrait afficher le titre 'Paramètres du compte'", () => {
    expect(screen.getByText("Paramètres du compte")).toBeInTheDocument();
  });

  it("devrait afficher la case à cocher pour les notifications", () => {
    expect(screen.getByLabelText("Notifications :")).toBeInTheDocument();
  });

  it("devrait afficher la case à cocher pour le thème sombre", () => {
    expect(screen.getByLabelText("Thème sombre :")).toBeInTheDocument();
  });

  it("devrait afficher le bouton 'Enregistrer les modifications'", () => {
    expect(
      screen.getByRole("button", { name: "Enregistrer les modifications" })
    ).toBeInTheDocument();
  });
});

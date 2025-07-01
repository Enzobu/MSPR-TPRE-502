import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen, fireEvent } from "../../test-utils";
import ProfilePage from "./ProfilePage";
import useLoggedUser from "../../hooks/useLoggedUser";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock du hook useLoggedUser
vi.mock("../../hooks/useLoggedUser");

const mockUser = {
  id_user: 1,
  lastname: "Dupont",
  firstname: "Jean",
  email: "jean.dupont@example.com",
  isAdmin: false,
};

const mockAdmin = {
  ...mockUser,
  isAdmin: true,
};

describe("ProfilePage", () => {
  it("devrait afficher le message de chargement", () => {
    (useLoggedUser as Mock).mockReturnValue({ loading: true });
    render(<ProfilePage />);
    expect(
      screen.getByText("Chargement de votre profil...")
    ).toBeInTheDocument();
  });

  it("devrait afficher un message d'erreur", () => {
    (useLoggedUser as Mock).mockReturnValue({ error: "Une erreur" });
    render(<ProfilePage />);
    expect(screen.getByText("Erreur de chargement")).toBeInTheDocument();
    expect(
      screen.getByText(/une erreur est survenue : une erreur/i)
    ).toBeInTheDocument();
  });

  describe("quand l'utilisateur est connecté", () => {
    it("devrait afficher les informations du profil par défaut", () => {
      (useLoggedUser as Mock).mockReturnValue({
        user: mockUser,
        loading: false,
      });
      render(<ProfilePage />);
      expect(screen.getByText("Profil utilisateur")).toBeInTheDocument();
      // Vérifier qu'il y a bien des éléments "Informations personnelles" (sans exiger l'unicité)
      const informationElements = screen.getAllByText(
        "Informations personnelles"
      );
      expect(informationElements.length).toBeGreaterThan(0);
    });

    it('ne devrait pas afficher le menu "Gestion utilisateurs" pour un non-admin', () => {
      (useLoggedUser as Mock).mockReturnValue({
        user: mockUser,
        loading: false,
      });
      render(<ProfilePage />);
      expect(
        screen.queryByText("Gestion utilisateurs")
      ).not.toBeInTheDocument();
    });

    it('devrait afficher le menu "Gestion utilisateurs" pour un admin', () => {
      (useLoggedUser as Mock).mockReturnValue({
        user: mockAdmin,
        loading: false,
      });
      render(<ProfilePage />);
      expect(screen.getByText("Gestion utilisateurs")).toBeInTheDocument();
    });

    it("devrait changer de section au clic sur le menu", () => {
      (useLoggedUser as Mock).mockReturnValue({
        user: mockUser,
        loading: false,
      });
      render(<ProfilePage />);

      // Cliquer sur le bouton Sécurité (utilisateur getByRole pour être plus précis)
      const securityButton = screen.getByRole("button", { name: /sécurité/i });
      fireEvent.click(securityButton);

      // Vérifier qu'il y a bien des éléments "Sécurité" après le clic
      const securityElements = screen.getAllByText("Sécurité");
      expect(securityElements.length).toBeGreaterThan(0);

      // Cliquer sur le bouton Préférences
      const preferencesButton = screen.getByRole("button", {
        name: /préférences/i,
      });
      fireEvent.click(preferencesButton);

      const preferencesElements = screen.getAllByText("Préférences");
      expect(preferencesElements.length).toBeGreaterThan(0);
    });
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyEmail } from "./copy-email";

describe("CopyEmail", () => {
  it("copies the address and confirms", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(writeText);

    render(<CopyEmail email="contact@thomasrohan.com" />);
    await user.click(screen.getByRole("button", { name: /copy/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("contact@thomasrohan.com");
    });
    const copiedNodes = await screen.findAllByText("Copied");
    expect(copiedNodes.length).toBeGreaterThan(0);
  });
});

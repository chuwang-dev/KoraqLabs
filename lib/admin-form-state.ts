export type SaveFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export const initialSaveFormState: SaveFormState = { status: "idle" };

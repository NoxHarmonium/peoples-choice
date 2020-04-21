import React from "react";

export const ErrorComponent = ({ error }: { readonly error: Error }) => (
  <div>
    <p>{JSON.stringify(error, undefined, 2)}</p>
  </div>
);

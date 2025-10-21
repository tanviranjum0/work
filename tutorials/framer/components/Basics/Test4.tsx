"use client";

import React from "react";
import Image from "next/image";
// https://www.geeksforgeeks.org/javascript/how-to-convert-base64-to-file-in-javascript/ ||For Base64 to file
// https://www.geeksforgeeks.org/javascript/how-to-convert-image-into-base64-string-using-javascript/ ||For image to Base64
const Test4 = () => {
  let base64String = "";
  function imageUploaded(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    // const display = document.getElementById("imgDisplay") as HTMLImageElement;

    if (!input?.files) return;
    let file = input.files[0];
    let reader = new FileReader();
    reader.onload = function () {
      if (reader.result) {
        base64String = (reader.result as string)
          .replace("data:", "")
          .replace(/^.+,/, "");
      }
      console.log(base64String);
    };

    reader.readAsDataURL(file);
    // display.src = URL.createObjectURL(file);
  }

  function displayString() {
    console.log("Base64String about to be printed");
    alert(base64String);
  }

  // Function to convert Base64 string to Blob and trigger download
  function base64ToFile(Bstring: string, mimeType: string, fileName: string) {
    // Remove data URL scheme if present
    const base64Data = Bstring.replace(/^data:.+;base64,/, "");
    const byteCharacters = atob(base64Data); // Decode Base64 string
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const fName = "my-document.txt";
    const fileOptions = {
      type: blob.type,
      lastModified: new Date().getTime(), // Optional: set last modified date
    };
    const myFile = new File([blob], fName, fileOptions);
    console.log(myFile);

    document
      .getElementById("testingImage")
      ?.setAttribute("src", URL.createObjectURL(myFile));

    // Create a link element to download the file
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  }

  // Base64 string representing an image (JPEG in this case)
  const Bstring = `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
Sr9w4jatKm+38z//Z`; // Replace with your actual Base64 string
  const mimeType = "image/jpeg"; // MIME type for JPEG image
  const fileName = "image.jpg"; // Desired file name with extension

  // if (typeof document !== "undefined") {
  //   document.getElementById("download")?.addEventListener("click", () => {
  //     base64ToFile(Bstring, mimeType, fileName);
  //   });
  // }
  return (
    <div className="bg-amber-400 h-[100vh] flex justify-center items-center">
      <input
        className="border bg-gray-300"
        type="file"
        name=""
        id="fileId"
        onChange={imageUploaded}
      />
      <button className="p-3 bg-cyan-300 rounded" onClick={displayString}>
        Display String
      </button>
      <div className="h-36 w-36 relative bg-emerald-400">
        <Image
          className="absolute h-36 w-36"
          fill={true}
          id="imgDisplay"
          src={
            "data:image/jpeg;base64,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"
          }
          alt=""
        />
      </div>
      <div className="h-36 w-36 relative bg-orange-400">
        <img
          className="absolute h-36 w-36"
          id="testingImage"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAM1BMVEX///+ZmZmVlZXZ2dmQkJDk5OS8vLzo6OjS0tK1tbXz8/P7+/v39/fs7OykpKTHx8eqqqq8lpdBAAAEZUlEQVR4nO1b2ZasIAyUiCLt+v9fe1unZ7pdoBJA23Mu9S4WIQkhS1FkZGRkZGRkZGRkZGRcgO7R98ZUVWVM/+i+zeYJ09R2GhS9oIbJ1o35Hp9HNQ5aP4lsQFrrYaweX6BU1QPpHaE/aBrq6lpG/ag8hP4kpsa+KNqLKFkFGb14KdtfQslMmsfoJa7pfLXv2FL6kNa5bqId98bGoEXjiYplpgBKM/R0mmo12OLctM4RVmfDKT1B9gRWlVTBd6xUcmdaxjH6QZmWUxMpph9Qcz9OaVk1Eh/uhU7GqklFSaWTVZlMTgurJNpesX71G3kykMAztAxGWtmxKctmtApLlVT0/dxCP/6MAj72XuEogmwsqRH9QttNvGQskhaNcZwM+AEdeWno/XVUzNCCWIXUYVhpwBHSFHM5o8MbHO+ox+D/LuYAO8CJnOG3QV+GWyCwPJ8fLMGnwRZo/LtVk+9jFDmHvnGQlnttqEe6Hsap97sDdALg7APdgvUuCuPIU7SqB5wUSKs80PchohqBMx/QAmf4KrRRKP4aXZtyThW69eBG0XWg5YEV2ieOa2FkX0s5oduLIylEynVzOlHBUC36+BRJzw+uiBUdx6xS+xsgqViXwFliA8azCmgEdL5P+5NxQmGwwubHeOprWajAeKiDmBZF0px9bQC9sUJvXc67mmSeipW18+lpi9VcMSz4E93EWdJn0tilzAtMklAd+vPXos4DBMHUL0Q+nWHOP3CwYicjJTEVeiEBVvwEqcQn8ElRvVOLrmYntNwPxwPA6/hj3WkjrBLfUO+PJVeygNTTL6vRvMTVmZGRobqC1JznGGw9jrUdhBUAESnG1bddnptcjCAlWZ82kHx6hvWRXmr+K8wdAdxyl4gUz3mSsmX/2MUKbdeXVvEkJnGejGuGyPqjBMugJbpm8IVM2/zrHgaHGqILGabLBlbdAPpRWZLDH+RRzUykgiy8MMjzhsOSUpQ3UheGw17vKSr5+CIG4cPB88SS5iU8mRLhE8v9kpQX7JwnSNLHqCs7oQNSXcnWcsQJ4s0tcHgGcYLD5dODKoiOOqY4FXTsqYSOJflih0ajA0sq3eFiAVJPKCiHqALWOXrjBtekD7RKh+zwIKYKrKfMOAg7guogu8s0pnS481WBxbVdwSim9JtssW3ai8I5Fe12rVBV2BYhI1Rqv8PgRsu1VoU7hBlrpxDRMLEubMf1OKw9TERhe20zcV1GqwAman/tdA6pqGaJlSWnIxXXVrJShWSkYhtwPh9JcT1i79RsfKvSR1MX1WUE3i5hSNAa+3HBb5M+ErxXSdIYe8dGwXStpwundI2eN2w+vWebbipWKeU0o4xtR5+RuPU7RZP8cMLE0R3HCYooIyTdnDWlEjyiQmeOGYUN86hTh3mKW449zZANiKkrBsRm8Efp9FWjdAst5tBhfR2lBfN4ppsXfWE8c8FrkFVtz5Loa4OsL9xt5PcPy3B0daPh6IyMjIyMjIyMjIyM/wD/AKrlLaHofErWAAAAAElFTkSuQmCC"
          alt=""
        />
      </div>
      <div
        className="p-3 cursor-pointer bg-sky-400"
        id="download"
        onClick={() => base64ToFile(Bstring, mimeType, fileName)}
      >
        Download
      </div>
    </div>
  );
};

export default Test4;

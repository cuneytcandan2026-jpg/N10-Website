import fs from "node:fs";

const files = ["index.html", "about.html", "coaches.html", "coaching.html"];
const names = [
  "About us",
  "Teamphoto",
  "Coach and team",
  "C5C294E1-8716-448A-8AF3-D3344A426B5B",
  "C16E2015-B516-4C26-AB11-F205D210908F",
  "E643E6EF-FF1D-4149-928B-985FE3F29946",
  "BD7C0CD2-341D-4487-B508-EA3FFE7A34EB",
  "IMG_1167",
  "3AF9B34A-0553-4C7E-A957-7963D470D43B",
  "IMG_1343",
  "D559B2BE-44BA-4A5D-9671-DA0D2154386E",
  "Arda 2 ",
  "IMG_1317",
  "IMG_1349",
  "Coach 5",
  "Coach 1",
  "Coach 2",
  "Coach3",
  "Coach 6",
  "Coach 4",
];

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const f of files) {
  let content = fs.readFileSync(f, "utf8");
  let changed = 0;
  for (const name of names) {
    const encoded = name.replace(/ /g, "%20");
    for (const n of [name, encoded]) {
      const re = new RegExp(escapeRe(n) + "\\.(jpg|jpeg|JPG|JPEG|png|PNG)", "g");
      const before = content;
      content = content.replace(re, n + ".webp");
      if (content !== before) changed++;
    }
  }
  fs.writeFileSync(f, content);
  console.log(f, "replacements:", changed);
}

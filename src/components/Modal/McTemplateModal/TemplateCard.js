export const TemplateCard = {
  delimiters: ["#{", "}"],
  props: ["template"],
  template: `<div class='mc-temp-card'>
                <div class='text-md-500'>#{template.title}</div>
                <div class='text-overflow'>#{template.text}</div>
            </div>
  `,
};

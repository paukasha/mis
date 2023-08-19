export const VListItem = {
    delimiters: ["#{", "}"],
    props: ['title'],
    template: `<li class='menu-item'>
        <slot name=prepend></slot>
        #{title}</li>`
}
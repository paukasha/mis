export const BtnsWrapper = {
  delimiters: ['#{', '}'],
  props: ['errText'],
  template: `<div class='btns-wrapper'>
              <div v-if='errText'
                   class='btns-submit-error'>
                #{errText}
              </div>

              <div class='btns-wrapper__left'>
                <slot name='left-btns'></slot>
              </div>
              
              <div class='btns-wrapper__right'>
                <slot name='right-btns'></slot>
              </div>
</div>
`
}
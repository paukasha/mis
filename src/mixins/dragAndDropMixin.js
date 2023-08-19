export const dragAndDropMixin = {
  methods: {
    startDrag(e, appoint, isTask) {
      this.dragHelperLineHeight = e.target.style.height;
      this.isDrag = true;
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      let dataTransferObj = {
        ...appoint,
        appointDrag: true,
        isTask,
      };

      e.dataTransfer.setData('PatientData', JSON.stringify(dataTransferObj));
    },
  }
}
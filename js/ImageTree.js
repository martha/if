export function ImageTree(root) {
    this.root = root;
    this.currentImage = root;
    const things = buildClickableList(root);  // todo - fix this mess
    this.imageMap = things[0];
    this.clickables = things[1];

    this.selectImage = function(clickableUuid) {
        const image = this.imageMap[clickableUuid];
        this.currentImage.showImage = false;
        this.currentImage = image;
        this.currentImage.showImage = true;

        // buildClickableList();
        traverseTree(this.root);
    }

    function buildClickableList(currentImage) {
        const imageMap = {};
        const clickables = [];
        for (const img of currentImage.children) {  // todo - add siblings later, they should also be clickable (but not self)
            if (img.clickable) {
                imageMap[img.clickable.uuid] = img;
                clickables.push(img.clickable);
            }
        }
        return [imageMap, clickables];
    }

    function traverseTree(root) {  // todo - shouldn't have to put root in
        const allImages = [];
        const bfsStack = [root];
        while (bfsStack.length > 0) {  // todo - implement this in a non image specific code way
            const img = bfsStack.shift();
            allImages.push(img);
            Array.prototype.push.apply(bfsStack, img.children);
        }
        console.log(allImages);
        return allImages;
    }
}

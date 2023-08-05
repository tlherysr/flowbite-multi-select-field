function toCamelCase (str) {
    return str.toLowerCase().replace(/\s+/g, '-');
}

function isAllTicked( tickBoxes ) {
    for ( let i = 1; i < tickBoxes.length; i++ ) {
        if ( tickBoxes[i].classList.contains('bg-gray-100') ) return false;
    }
    return true;
}

function MultiSelectDropdown(options) {
    let config={
        placeholder: "Select",
        txtSelected: 'Selected',
        txtAll: 'Select All',
        txtRemove: 'Remove',
        ...options
    };

    function newEl(tag, attrs) {
        let e = document.createElement(tag);
        if ( attrs !== undefined) Object.keys(attrs).forEach( k => {
            if ( k === 'class' ) { Array.isArray ( attrs[k] ) ? attrs[k].forEach( o => o !== ''?e.classList.add(o):0) : (attrs[k] !== ''?e.classList.add(attrs[k]):0)}
            else if ( k === 'style' ) {
                Object.keys(attrs[k]).forEach( ks => {
                    e.style[ks]=attrs[k][ks];
                });
            }
            else if ( k === 'text' ) { attrs[k] === ''?e.innerHTML='&nbsp;':e.innerText=attrs[k]}
            else e[k]=attrs[k];
        });
        return e;
    }

    document.querySelectorAll("select[multiple]").forEach( (el, _k) => {
        config.placeholder = el.closest('div').querySelector('label').textContent;

        let div = newEl('div', {class: ['container', 'relative']});
        el.style.display = 'none';
        el.parentNode.insertBefore(div, el.nextSibling);

        const listButton = newEl('div', {class: ["flex", "flex-row", "justify-between", "bg-gray-50", "border", "border-gray-300", "text-gray-900", "text-sm", "rounded-lg", "focus:ring-blue-500","focus:border-blue-500", "w-full", "p-2.5", "dark:bg-gray-700", "dark:border-gray-600", "dark:placeholder-gray-400", "dark:text-white", "dark:focus:ring-blue-500", "dark:focus:border-blue-500", "cursor-pointer"]});
        const list = newEl('ul', {class: ["hidden", "bg-gray-50", "text-sm", "font-medium", "text-gray-900", "border", "border-gray-200", "rounded-lg", "dark:bg-gray-700", "dark:border-gray-600", "dark:text-white", "absolute", "w-full", "transform", "transition", "duration-300", "h-64", "overflow-auto"]});
        const listButtonSpan1 = newEl('span', {class: "main-placeholder"});
        const listButtonSpan2 = newEl('span', {class: ["transition", "duration-300"]});
        const listButtonIcon = newEl('i', {class: ["fa-solid", "fa-chevron-down", "fa-sm"]});

        listButtonSpan2.appendChild(listButtonIcon);
        listButton.appendChild(listButtonSpan1);
        listButton.appendChild(listButtonSpan2);
        div.appendChild(listButton);
        div.appendChild(list);

        el.loadOptions = () => {
            list.innerHTML = "";

            if ( el.attributes['multiselect-select-all'] ) {
                const op=newEl('li',{id: 'select-all-option', class: ["multiselect-dropdown-all-selector", "w-full", "rounded-t-lg", "dark:border-gray-600", "hover:bg-blue-50", "transition", "duration-300"]});
                const opDiv=newEl('div', {class: ['flex', 'items-center', 'pl-3']});
                const cb=newEl('input', {type: 'checkbox', class: ["flex", "items-center", "justify-center", "w-4", "h-4", "bg-gray-100", "border-gray-300", "rounded", "focus:ring-0", "focus:ring-offset-0", "dark:bg-gray-600", "dark:border-gray-500", "transition", "duration-300", "cursor-pointer"]});
                const lbl=newEl('label', {class: ["w-full", "py-3", "ml-2", "text-sm", "font-medium", "text-gray-900", "dark:text-gray-300", "cursor-pointer"], text: 'Select All'});

                op.appendChild(opDiv);
                opDiv.appendChild(cb);
                opDiv.appendChild(lbl);

                op.addEventListener('click',()=>{
                    op.classList.toggle('checked');
                    op.querySelector("input").checked=!op.querySelector("input").checked;
                    
                    const ch=op.querySelector("input").checked;
                    list.querySelectorAll(":scope > li:not(.multiselect-dropdown-all-selector)")
                        .forEach(i=>{if(!i.classList.contains('hidden')){i.querySelector("input").checked=ch; i.optEl.selected=ch}});
            
                    el.dispatchEvent(new Event('change'));
                });
                cb.addEventListener('click',(ev)=>{
                    cb.checked=!cb.checked;
                });
                el.addEventListener('change', (ev)=>{
                    let itms=Array.from(list.querySelectorAll(":scope > li:not(.multiselect-dropdown-all-selector)")).filter(e=>!e.classList.contains('hidden'));
                    let existsNotSelected=itms.find(i=>!i.querySelector("input").checked);
                    if(cb.checked && existsNotSelected) cb.checked=false;
                    else if(!cb.checked && existsNotSelected===undefined) cb.checked=true;
                });
                list.appendChild(op);
            }

            Array.from(el.options).map(o=>{
                const op=newEl('li',{class: ["w-full", "rounded-t-lg", "dark:border-gray-600", "hover:bg-blue-50", "transition", "duration-300", o.selected?'checked':''],optEl:o});
                const opDiv=newEl('div', {class: ['flex', 'items-center', 'pl-3']});
                const cb=newEl('input', {type: 'checkbox', id:'userId', class: ["flex", "items-center", "justify-center", "w-4", "h-4", "bg-gray-100", "border-gray-300", "rounded", "focus:ring-0", "focus:ring-offset-0", "dark:bg-gray-600", "dark:border-gray-500", "transition", "duration-300", "cursor-pointer"], checked:o.selected});
                const lbl=newEl('label', {class: ["w-full", "py-3", "ml-2", "text-sm", "font-medium", "text-gray-900", "dark:text-gray-300", "cursor-pointer"], text:o.text});
                
                op.appendChild(opDiv);
                opDiv.appendChild(cb);
                opDiv.appendChild(lbl);

                op.addEventListener('click',()=>{
                    op.classList.toggle('checked');
                    op.querySelector("input").checked=!op.querySelector("input").checked;
                    op.optEl.selected=!!!op.optEl.selected;
                    el.dispatchEvent(new Event('change'));
                });
                cb.addEventListener('click',(ev)=>{ 
                    cb.checked=!cb.checked;
                });
                o.listitemEl=op;
                list.appendChild(op);
            });
            div.listEl=list;

            div.refresh=()=>{
                div.querySelectorAll('span.optext, span.placeholder').forEach(t=>listButtonSpan1.removeChild(t));

                const sels=Array.from(el.selectedOptions);
                if(sels.length>0) listButtonSpan1.textContent="";
                if(sels.length>(el.attributes['multiselect-max-items']?.value??5)){
                    listButtonSpan1.appendChild(newEl('span',{class:['optext','maxselected'],text:sels.length+' '+config.txtSelected}));
                }
                else {
                    sels.map(x=>{
                        const c=newEl('span',{id:toCamelCase(x.text), class:["placeholder", "bg-blue-100", "text-blue-800", "text-xs", "font-medium", "mr-2", "px-2.5", "py-0.5", "rounded", "dark:bg-blue-900", "dark:text-blue-300"],text:x.text,srcOption:x});
                        listButtonSpan1.appendChild(c);
                    });
                }
                if(el.selectedOptions.length===0) listButtonSpan1.textContent = el.attributes['placeholder']?.value??config.placeholder;
            };
            div.refresh();
        };

        el.loadOptions();

        listButton.addEventListener('click',()=>{
            div.listEl.classList.toggle("hidden");
            listButtonSpan2.classList.toggle("rotate-180");
            div.refresh();
        });

        document.addEventListener('click', function(event) {
            if (!div.contains(event.target)) {
                div.listEl.classList.add("hidden");
                div.refresh();
            }
        });
    });
    
}

window.addEventListener('load', () => {
    MultiSelectDropdown();
});
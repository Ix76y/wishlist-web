<script>
    export let title;
    export let id;
    export let placeholder = "";
    export let type = "text";
    export let value = "";
    export let disabled = false;
</script>

<fieldset class="w-full space-y-1 text-slate-700 dark:text-slate-400">
    <label for="{id}" class="block text-sm font-medium">{title}</label>
    <input type="{type}" disabled={disabled} name="{id}" id="{id}" value="{value}" placeholder="{placeholder}" class="w-full focus:outline-none focus:border-indigo-400 sm:text-sm rounded-md focus:ring-0 border-gray-700 bg-gray-50 dark:bg-gray-800 ">
</fieldset>
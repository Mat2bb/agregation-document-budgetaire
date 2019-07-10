<script>
	import FormulaPreview from './FormulaPreview.svelte'

	export let formula;
	export let planDeCompte;
	export let lignes;
	export let examples;
</script>

<style>
input.formula{
	width: 100%;
	margin-bottom: 0.5em;

	font-size: 1.6em;
	font-family: monospace;
}
</style>

<h1>Outil de test de formules</h1>

<h2>Un outil pour filtrer les lignes d'un document budgétaires</h2>
<p>Pour le moment, cet outil ne filtre que les données des <a href="https://www.datalocale.fr/dataset/comptes-administratifs-budget-principal-donnees-budgetaires-du-departement-de-la-gironde">Comptes Administratifs du Département de la Gironde</a> pour l'année 2017</p>

<h2>Exemples de yopo formules</h2>

<ul class="examples">
	{#each examples as {formula, description}}
		<li>
			<a href="#{encodeURIComponent(formula)}"><code>{formula}</code></a>
			<span> : {description}</span>
		</li>
	{/each}
</ul>

<input class="formula" type="text" bind:value={formula}>

<FormulaPreview {lignes} {planDeCompte}/>

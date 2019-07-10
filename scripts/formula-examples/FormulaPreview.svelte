<script>
    import {sum} from 'd3-array'
    
	export let lignes;
	export let planDeCompte;
    
    $: total = lignes && sum(lignes.map(r => r['MtReal'])).toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})
</script>

<style>

output{
	background-color: #EEE;
	white-space: pre;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}

output table tbody td{
	padding: 0 0.5em;
}

output table tbody td:nth-child(4),
output table tbody td:nth-child(5){
	text-align: right;
}
</style>

{#if planDeCompte && lignes}

    <h1>Compte Administratif Gironde {planDeCompte.Exer}</h1>
    <h2>{lignes.length} lignes | {total}</h2>

    <output>
        <table>
            <thead>
                <tr>
                    {#each ['RD', 'FI', 'Fonction', 'Nature', 'Montant'] as t}
                        <th>{t}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each lignes as l (l)}
                    <tr>
                        <td>{l['CodRD']}</td>
                        <td>{planDeCompte.ligneBudgetFI(l)}</td>
                        <td>{l['Fonction']}</td>
                        <td>{l['Nature']}</td>
                        <td>{l['MtReal'].toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </output>

{/if}
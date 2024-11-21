<template>
	<q-page padding>
		<h1 class="text-h6 text-center q-mb-md">BURÓ DE CRÉDITO ECUADOR</h1>
		<p class="text-center">Recopilación de información de los clientes.</p>

		<div class="row">
			<div class="col-12">
				<essential-table :configuracionColumnas="configuracionColumnasEmailMarketing" :datos="listado"
					:permitir-consultar="false" :permitir-editar="false" :permitir-eliminar="false">
				</essential-table>
			</div>
		</div>
	</q-page>
</template>

<script src="./MarketingPage.ts"></script>

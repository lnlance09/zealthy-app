<?php

if (!function_exists('formatFullName')) {
    /**
     * Format a name into first, middle, and last
     *
     * @param string $name
     * @return array | false
     */
    function formatFullName(String $name)
    {
        $exp = explode(' ', $name);
        if (count($exp) === 1) {
            return [
                'first' => $exp[0],
                'middle' => null,
                'last' => null
            ];
        }
        if (count($exp) === 2) {
            return [
                'first' => $exp[0],
                'middle' => null,
                'last' => $exp[1]
            ];
        }
        if (count($exp) === 3) {
            return [
                'first' => $exp[0],
                'middle' => $exp[1],
                'last' => $exp[2]
            ];
        }
        if (count($exp) === 4) {
            return [
                'first' => $exp[0],
                'middle' => $exp[1] . ' ' . $exp[2],
                'last' => $exp[3]
            ];
        }
        return false;
    }
}

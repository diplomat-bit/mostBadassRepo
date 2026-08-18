// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/internal/apiform/form.go
================================================================================

package apiform

type Marshaler interface {
	MarshalMultipart() ([]byte, string, error)
}
